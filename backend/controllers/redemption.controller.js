const { aysncHandler } = require("../utils/aysncHandler");
const { validationResult } = require("express-validator");
const {
  BadRequestException,
  NotFoundException,
} = require("../libs/errorExceptionSchema");
const User = require("../models/user.model");
const PointTransaction = require("../models/pointTransaction.model");
const Redemption = require("../models/redemption.model");
const { onSuccess } = require("../libs/responseWrapper");
const errorMessages = require("../libs/errorMessages");
const successMessages = require("../libs/successMessages");
const { TRANSACTION_TYPES, REDEMPTION_STATUS } = require("../constants");

/**
 * Request points redemption
 */
const createRedemptionRequest = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { points, rewardType = "travel_credit", paymentDetails, notes } = req.body;
  const requestedPoints = Number(points);

  if (requestedPoints < 50) {
    return next(new BadRequestException(errorMessages.MINIMUM_REDEMPTION_POINTS));
  }

  const userId = req.user._id;

  // Verify user balance from transaction ledger
  const txAgg = await PointTransaction.aggregate([
    { $match: { userId, status: "completed" } },
    { $group: { _id: null, balance: { $sum: "$points" } } },
  ]);

  const currentBalance = txAgg.length > 0 ? txAgg[0].balance : 0;
  if (currentBalance < requestedPoints) {
    return next(new BadRequestException(errorMessages.INSUFFICIENT_POINTS));
  }

  // Create redemption record
  const redemption = await Redemption.create({
    userId,
    points: requestedPoints,
    rewardType,
    paymentDetails,
    notes,
    status: REDEMPTION_STATUS.PENDING,
  });

  // Deduct points via a completed negative PointTransaction
  await PointTransaction.create({
    userId,
    purchaseDescription: `Solicitud de canje de puntos #${redemption._id}`,
    type: TRANSACTION_TYPES.REDEMPTION,
    level: null,
    points: -requestedPoints,
    status: "completed",
    metadata: { redemptionId: redemption._id },
  });

  // Update cached user points
  await User.findByIdAndUpdate(userId, {
    $inc: {
      "pointsStats.availablePoints": -requestedPoints,
      "pointsStats.redeemedPoints": requestedPoints,
    },
  });

  return res
    .status(201)
    .json(onSuccess(successMessages.REDEMPTION_REQUESTED, redemption));
});

/**
 * Get current user's redemptions
 */
const getMyRedemptions = aysncHandler(async (req, res) => {
  const userId = req.user._id;
  const redemptions = await Redemption.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(onSuccess(successMessages.FETCH_REDEMPTIONS, redemptions));
});

/**
 * Admin: Get all redemptions with filters
 */
const getAllRedemptionsAdmin = aysncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [redemptions, total] = await Promise.all([
    Redemption.find(filter)
      .populate("userId", "fullname email membershipId phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Redemption.countDocuments(filter),
  ]);

  return res.status(200).json(
    onSuccess(successMessages.FETCH_REDEMPTIONS, {
      redemptions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  );
});

/**
 * Admin: Update redemption status (approve / complete / reject)
 */
const updateRedemptionStatusAdmin = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  if (!Object.values(REDEMPTION_STATUS).includes(status)) {
    return next(new BadRequestException(errorMessages.INVALID_STATUS));
  }

  const redemption = await Redemption.findById(id);
  if (!redemption) {
    return next(new NotFoundException(errorMessages.REDEMPTION_NOT_FOUND));
  }

  // If rejecting an existing pending redemption, refund the points!
  if (
    status === REDEMPTION_STATUS.REJECTED &&
    redemption.status === REDEMPTION_STATUS.PENDING
  ) {
    await PointTransaction.create({
      userId: redemption.userId,
      purchaseDescription: `Reembolso por canje rechazado #${redemption._id}`,
      type: TRANSACTION_TYPES.MANUAL_ADJUSTMENT,
      level: null,
      points: redemption.points,
      status: "completed",
    });

    await User.findByIdAndUpdate(redemption.userId, {
      $inc: {
        "pointsStats.availablePoints": redemption.points,
        "pointsStats.redeemedPoints": -redemption.points,
      },
    });
  }

  redemption.status = status;
  if (adminNotes) redemption.adminNotes = adminNotes;
  redemption.processedAt = new Date();
  redemption.processedBy = req.user._id;
  await redemption.save();

  return res
    .status(200)
    .json(onSuccess(successMessages.REDEMPTION_STATUS_UPDATED, redemption));
});

module.exports = {
  createRedemptionRequest,
  getMyRedemptions,
  getAllRedemptionsAdmin,
  updateRedemptionStatusAdmin,
};

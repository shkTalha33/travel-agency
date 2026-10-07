const { aysncHandler } = require("../utils/aysncHandler");
const { validationResult } = require("express-validator");
const {
  BadRequestException,
  NotFoundException,
} = require("../libs/errorExceptionSchema");
const User = require("../models/user.model");
const PointTransaction = require("../models/pointTransaction.model");
const Offer = require("../models/offer.model");
const { onSuccess } = require("../libs/responseWrapper");
const errorMessages = require("../libs/errorMessages");
const successMessages = require("../libs/successMessages");
const {
  MEMBERSHIP_TIERS,
  MEMBERSHIP_CONFIG,
  TRANSACTION_TYPES,
} = require("../constants");

/**
 * Get Points Summary for the authenticated user
 */
const getMyPointsSummary = aysncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select("pointsStats membershipId");

  // Calculate live aggregations from the ledger for guaranteed consistency
  const aggregations = await PointTransaction.aggregate([
    {
      $match: {
        userId: userId,
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$type",
        totalPoints: { $sum: "$points" },
      },
    },
  ]);

  let level1Points = 0;
  let level2Points = 0;
  let totalEarned = 0;
  let totalRedeemed = 0;

  aggregations.forEach((item) => {
    if (item._id === TRANSACTION_TYPES.REFERRAL_L1) {
      level1Points += item.totalPoints;
      totalEarned += item.totalPoints;
    } else if (item._id === TRANSACTION_TYPES.REFERRAL_L2) {
      level2Points += item.totalPoints;
      totalEarned += item.totalPoints;
    } else if (item._id === TRANSACTION_TYPES.MANUAL_ADJUSTMENT && item.totalPoints > 0) {
      totalEarned += item.totalPoints;
    } else if (item._id === TRANSACTION_TYPES.REDEMPTION) {
      totalRedeemed += Math.abs(item.totalPoints);
    }
  });

  const availablePoints = Math.max(0, totalEarned - totalRedeemed);

  const stats = {
    availablePoints,
    totalEarnedPoints: totalEarned,
    redeemedPoints: totalRedeemed,
    level1Points,
    level2Points,
    membershipId: user.membershipId,
  };

  return res
    .status(200)
    .json(onSuccess(successMessages.FETCH_POINTS_SUMMARY, stats));
});

/**
 * Get Points Transaction History for the authenticated user
 */
const getMyTransactions = aysncHandler(async (req, res) => {
  const userId = req.user._id;
  const { type, page = 1, limit = 50 } = req.query;

  const filter = { userId, status: "completed" };
  if (type) filter.type = type;

  const skip = (Number(page) - 1) * Number(limit);

  const [transactions, total] = await Promise.all([
    PointTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    PointTransaction.countDocuments(filter),
  ]);

  const formattedTransactions = transactions.map((t) => ({
    id: t._id,
    iso: t.createdAt.toISOString().split("T")[0],
    createdAt: t.createdAt,
    type: t.type,
    level: t.level,
    memberId: t.sourceUserId,
    sourcePerson: t.sourcePersonName || "Sistema",
    purchaseDescription: t.purchaseDescription,
    points: t.points,
    status: t.status,
  }));

  return res.status(200).json(
    onSuccess(successMessages.FETCH_TRANSACTIONS, {
      transactions: formattedTransactions,
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
 * Admin assigns offline travel purchase points to a member.
 * Rules applied (Spec §31–§33):
 * 1. Purchaser's own purchase points are recorded as 'purchase_points' for status qualification (not personal referral earnings).
 * 2. Level 1 Upline receives 100% points IF their membership is Active Member, Ambassador, or Elite Ambassador.
 * 3. Level 2 Upline receives 50% points IF their membership is Ambassador or Elite Ambassador.
 * 4. Level 3+ upline do NOT receive referral points.
 */
const adminAssignPurchasePoints = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { purchaserUserId, purchasePoints, offerTitle, offerId } = req.body;
  const pointsNumber = Number(purchasePoints);

  if (pointsNumber <= 0) {
    return next(new BadRequestException(errorMessages.POINTS_MUST_BE_POSITIVE));
  }

  const purchaser = await User.findById(purchaserUserId);
  if (!purchaser) {
    return next(new NotFoundException(errorMessages.PURCHASER_NOT_FOUND));
  }

  // 1. Record the offline purchase for the buyer (determines Active Member status)
  await PointTransaction.create({
    userId: purchaser._id,
    sourceUserId: purchaser._id,
    sourcePersonName: purchaser.fullname,
    sourceOfferId: offerId || null,
    purchaseDescription: `Compra offline: ${offerTitle}`,
    type: TRANSACTION_TYPES.PURCHASE_POINTS,
    level: null,
    points: pointsNumber,
    status: "completed",
  });

  // Automatically upgrade to Active Member if currently regular Member
  if (purchaser.membershipId === MEMBERSHIP_TIERS.MEMBER) {
    purchaser.membershipId = MEMBERSHIP_TIERS.ACTIVE_MEMBER;
    await purchaser.save({ validateBeforeSave: false });
  }

  const distributedCommissions = [];

  // 2. Level 1 Upline (Direct Sponsor) -> 100%
  if (purchaser.referredBy) {
    const level1User = await User.findById(purchaser.referredBy);
    if (level1User && level1User.status === "active") {
      const config =
        MEMBERSHIP_CONFIG[level1User.membershipId] || MEMBERSHIP_CONFIG.member;
      const rate = config.rates[1] || 0;

      if (rate > 0) {
        const earnedPoints = Math.round(pointsNumber * rate);
        await PointTransaction.create({
          userId: level1User._id,
          sourceUserId: purchaser._id,
          sourcePersonName: purchaser.fullname,
          sourceOfferId: offerId || null,
          purchaseDescription: offerTitle,
          type: TRANSACTION_TYPES.REFERRAL_L1,
          level: 1,
          points: earnedPoints,
          status: "completed",
        });

        // Update cached stats
        await User.findByIdAndUpdate(level1User._id, {
          $inc: {
            "pointsStats.availablePoints": earnedPoints,
            "pointsStats.totalEarnedPoints": earnedPoints,
            "pointsStats.level1Points": earnedPoints,
          },
        });

        distributedCommissions.push({
          level: 1,
          userId: level1User._id,
          name: level1User.fullname,
          points: earnedPoints,
          rate,
        });
      }

      // 3. Level 2 Upline (Sponsor's Sponsor) -> 50%
      if (level1User.referredBy) {
        const level2User = await User.findById(level1User.referredBy);
        if (level2User && level2User.status === "active") {
          const l2Config =
            MEMBERSHIP_CONFIG[level2User.membershipId] ||
            MEMBERSHIP_CONFIG.member;
          const l2Rate = l2Config.rates[2] || 0;

          if (l2Rate > 0) {
            const l2EarnedPoints = Math.round(pointsNumber * l2Rate);
            await PointTransaction.create({
              userId: level2User._id,
              sourceUserId: purchaser._id,
              sourcePersonName: purchaser.fullname,
              sourceOfferId: offerId || null,
              purchaseDescription: offerTitle,
              type: TRANSACTION_TYPES.REFERRAL_L2,
              level: 2,
              points: l2EarnedPoints,
              status: "completed",
            });

            // Update cached stats
            await User.findByIdAndUpdate(level2User._id, {
              $inc: {
                "pointsStats.availablePoints": l2EarnedPoints,
                "pointsStats.totalEarnedPoints": l2EarnedPoints,
                "pointsStats.level2Points": l2EarnedPoints,
              },
            });

            distributedCommissions.push({
              level: 2,
              userId: level2User._id,
              name: level2User.fullname,
              points: l2EarnedPoints,
              rate: l2Rate,
            });
          }
        }
      }
    }
  }

  return res.status(200).json(
    onSuccess(successMessages.PURCHASE_POINTS_ASSIGNED, {
      purchaser: {
        id: purchaser._id,
        name: purchaser.fullname,
        membershipId: purchaser.membershipId,
      },
      purchasePoints: pointsNumber,
      offerTitle,
      distributedCommissions,
    })
  );
});

module.exports = {
  getMyPointsSummary,
  getMyTransactions,
  adminAssignPurchasePoints,
};

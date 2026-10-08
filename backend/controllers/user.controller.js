const { aysncHandler } = require("../utils/aysncHandler");
const { validationResult } = require("express-validator");
const {
  BadRequestException,
  UnauthorizedAccess,
  NotFoundException,
} = require("../libs/errorExceptionSchema");
const User = require("../models/user.model");
const PointTransaction = require("../models/pointTransaction.model");
const { onSuccess } = require("../libs/responseWrapper");
const errorMessages = require("../libs/errorMessages");
const successMessages = require("../libs/successMessages");
const { MEMBERSHIP_CONFIG } = require("../constants");

const getProfile = aysncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken -emailVerificationToken -resetPasswordToken"
  );
  if (!user) return next(new NotFoundException(errorMessages.USER_NOT_FOUND));

  return res.status(200).json(onSuccess(successMessages.CURRENT_USER, user));
});

const updateProfile = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { fullname, phone, country, city, bio, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname: fullname ? fullname.trim() : undefined,
        phone: phone ? phone.trim() : undefined,
        country: country ? country.trim() : undefined,
        city: city ? city.trim() : undefined,
        bio: bio !== undefined ? bio.trim() : undefined,
        address: address !== undefined ? address.trim() : undefined,
      },
    },
    { new: true, runValidators: true }
  ).select(
    "-password -refreshToken -emailVerificationToken -resetPasswordToken"
  );

  return res
    .status(200)
    .json(onSuccess(successMessages.USER_DETAIL_UPDATED, user));
});

const updateAvatar = aysncHandler(async (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    return next(new BadRequestException(errorMessages.USER_AVATAR_MISSING));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(onSuccess(successMessages.USER_AVATAR_UPDATED, user));
});

const changePassword = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { newPassword, oldPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return next(new UnauthorizedAccess(errorMessages.UNAUTHORIZED_ACCESS));

  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    return next(new BadRequestException(errorMessages.PASSWORD_NOT_CORRECT));
  }

  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();

  return res
    .status(200)
    .json(onSuccess(successMessages.PASSWORD_UPDATED, {}));
});

const changeEmail = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email: normalizedEmail,
        isEmailVerified: false,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(onSuccess(successMessages.EMAIL_UPDATED, user));
});

const changeUsername = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { username } = req.body;
  const cleanUsername = username.toLowerCase().trim();

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { username: cleanUsername } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(onSuccess(successMessages.USERNAME_UPDATED, user));
});

/**
 * Get the user's referral network:
 * - Level 1 (Direct referrals)
 * - Level 2 (Referrals of Level 1)
 * Enforces membership visibility rules (§30-§33 & §36-§39)
 */
const getMyNetwork = aysncHandler(async (req, res) => {
  const userId = req.user._id;
  const membershipId = req.user.membershipId || "member";
  const config = MEMBERSHIP_CONFIG[membershipId] || MEMBERSHIP_CONFIG.member;
  const maxAllowed = config.maxReferralLevel;

  // Level 1: Users whose referredBy is this user
  const level1Users = await User.find({
    referredBy: userId,
    status: "active",
  })
    .select("fullname email avatar membershipId createdAt status")
    .lean();

  const level1Ids = level1Users.map((u) => u._id);

  // Level 2: Users whose referredBy is in level1Ids
  let level2Users = [];
  if (maxAllowed >= 2 && level1Ids.length > 0) {
    level2Users = await User.find({
      referredBy: { $in: level1Ids },
      status: "active",
    })
      .select("fullname email avatar membershipId createdAt status referredBy")
      .lean();
  }

  // Calculate points generated from transactions for each member
  const allNetworkIds = [
    ...level1Ids,
    ...level2Users.map((u) => u._id),
  ];

  const pointsAgg = await PointTransaction.aggregate([
    {
      $match: {
        userId: userId,
        sourceUserId: { $in: allNetworkIds },
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$sourceUserId",
        totalPoints: { $sum: "$points" },
      },
    },
  ]);

  const pointsMap = {};
  pointsAgg.forEach((p) => {
    pointsMap[p._id.toString()] = p.totalPoints;
  });

  const level1Map = {};
  level1Users.forEach((u) => {
    level1Map[u._id.toString()] = u.fullname;
  });

  // Decorate Level 1 members
  const level1Decorated = level1Users.map((m) => {
    const mIdStr = m._id.toString();
    const downlines = level2Users.filter(
      (l2) => String(l2.referredBy) === mIdStr
    ).length;

    return {
      id: m._id,
      name: m.fullname,
      email: m.email,
      avatar: m.avatar,
      status: m.membershipId,
      level: 1,
      joinedIso: m.createdAt,
      pointsGeneratedToUpline: pointsMap[mIdStr] || 0,
      downlineCount: downlines,
    };
  });

  // Decorate Level 2 members (only if allowed)
  let level2Decorated = [];
  if (maxAllowed >= 2) {
    level2Decorated = level2Users.map((m) => {
      const mIdStr = m._id.toString();
      const sponsorName = level1Map[String(m.referredBy)] || "Patrocinador N1";

      return {
        id: m._id,
        name: m.fullname,
        email: m.email,
        avatar: m.avatar,
        status: m.membershipId,
        level: 2,
        sponsorId: m.referredBy,
        sponsorName,
        joinedIso: m.createdAt,
        pointsGeneratedToUpline: pointsMap[mIdStr] || 0,
        downlineCount: 0,
      };
    });
  }

  const responseData = {
    membershipId,
    maxReferralLevel: maxAllowed,
    referralCode: req.user.referralCode,
    referralLink: req.user.referralLink,
    network: {
      level1: maxAllowed >= 1 ? level1Decorated : [],
      level2: maxAllowed >= 2 ? level2Decorated : [],
    },
    stats: {
      directReferralsCount: level1Decorated.length,
      secondLevelReferralsCount: level2Decorated.length,
      totalNetworkCount: level1Decorated.length + level2Decorated.length,
    },
  };

  return res
    .status(200)
    .json(onSuccess(successMessages.FETCH_NETWORK, responseData));
});

const deactivateAccount = aysncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { status: "deactivate" },
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(onSuccess(successMessages.DEACTIVATE_USER, {}));
});

/**
 * ==========================================
 * ADMIN CONTROLLERS FOR USER MANAGEMENT
 * ==========================================
 */

/**
 * Get all users with search, role/tier filtering, and pagination (Admin only)
 */
const getAllUsersAdmin = aysncHandler(async (req, res) => {
  const { search, membershipId, role, status, page = 1, limit = 20, sort = "-createdAt" } = req.query;

  const query = {};

  // Exclude current logged in admin from the user table
  if (req.user?._id) {
    query._id = { $ne: req.user._id };
  }

  if (search) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { fullname: searchRegex },
      { email: searchRegex },
      { username: searchRegex },
      { referralCode: searchRegex },
      { phone: searchRegex },
    ];
  }

  if (membershipId) {
    query.membershipId = membershipId;
  }

  if (role) {
    query.role = role;
  }

  if (status) {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password -refreshToken -emailVerificationToken -resetPasswordToken")
      .populate("referredBy", "fullname email username referralCode")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(query),
  ]);

  return res.status(200).json(
    onSuccess("Usuarios obtenidos correctamente", {
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  );
});

/**
 * Update user status, role, or membership tier (Admin only)
 */
const updateUserStatusAdmin = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role, membershipId, status, isEmailVerified, availablePoints } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return next(new NotFoundException(errorMessages.USER_NOT_FOUND));
  }

  const updates = {};
  if (role !== undefined) {
    updates.role = role;
    if (role === "admin") {
      updates.membershipId = null;
    }
  }

  if (membershipId !== undefined) {
    const finalRole = role !== undefined ? role : user.role;
    updates.membershipId = finalRole === "admin" ? null : membershipId;
  }

  if (status !== undefined) updates.status = status;
  if (isEmailVerified !== undefined) updates.isEmailVerified = isEmailVerified;
  if (availablePoints !== undefined && !isNaN(Number(availablePoints))) {
    updates["pointsStats.availablePoints"] = Math.max(0, Number(availablePoints));
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password -refreshToken -emailVerificationToken -resetPasswordToken");

  return res.status(200).json(
    onSuccess("Estado del usuario actualizado exitosamente", updatedUser)
  );
});

/**
 * Delete / deactivate a user permanently (Admin only)
 */
const deleteUserAdmin = aysncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(new NotFoundException(errorMessages.USER_NOT_FOUND));
  }

  // Prevent self-deletion of currently logged in admin
  if (user._id.toString() === req.user._id.toString()) {
    return next(new BadRequestException("No puede eliminar su propia cuenta de administrador"));
  }

  await User.findByIdAndDelete(id);

  return res.status(200).json(
    onSuccess("Usuario eliminado permanentemente", {})
  );
});

/**
 * Get comprehensive Admin Dashboard Statistics
 */
const getAdminDashboardStats = aysncHandler(async (req, res) => {
  const Offer = require("../models/offer.model");
  const Redemption = require("../models/redemption.model");
  const Contact = require("../models/contact.model");

  const [
    totalUsers,
    membersCount,
    activeMembersCount,
    ambassadorsCount,
    eliteAmbassadorsCount,
    activeOffersCount,
    pendingRedemptionsCount,
    newContactsCount,
    pointsAgg,
    recentUsers,
    recentTransactions,
  ] = await Promise.all([
    User.countDocuments({ status: "active" }),
    User.countDocuments({ membershipId: "member", status: "active" }),
    User.countDocuments({ membershipId: "active_member", status: "active" }),
    User.countDocuments({ membershipId: "ambassador", status: "active" }),
    User.countDocuments({ membershipId: "elite_ambassador", status: "active" }),
    Offer.countDocuments({ isFeatured: true }),
    Redemption.countDocuments({ status: "pending" }),
    Contact.countDocuments({ status: "new" }),
    PointTransaction.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$points" },
        },
      },
    ]),
    User.find()
      .select("fullname email username membershipId role status createdAt")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    PointTransaction.find()
      .populate("userId", "fullname email")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  let totalDistributed = 0;
  let totalRedeemed = 0;

  pointsAgg.forEach((item) => {
    if (item._id === "redemption") {
      totalRedeemed += Math.abs(item.total);
    } else {
      totalDistributed += item.total;
    }
  });

  const stats = {
    users: {
      total: totalUsers,
      member: membersCount,
      active_member: activeMembersCount,
      ambassador: ambassadorsCount,
      elite_ambassador: eliteAmbassadorsCount,
    },
    points: {
      totalDistributed,
      totalRedeemed,
      currentActiveLiability: Math.max(0, totalDistributed - totalRedeemed),
    },
    counts: {
      offers: activeOffersCount,
      pendingRedemptions: pendingRedemptionsCount,
      newContacts: newContactsCount,
    },
    recentUsers,
    recentTransactions,
  };

  return res.status(200).json(
    onSuccess("Estadísticas del panel administrativo", stats)
  );
});

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar,
  changePassword,
  changeEmail,
  changeUsername,
  getMyNetwork,
  deactivateAccount,
  getAllUsersAdmin,
  updateUserStatusAdmin,
  deleteUserAdmin,
  getAdminDashboardStats,
};

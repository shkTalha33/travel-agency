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

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar,
  changePassword,
  changeEmail,
  changeUsername,
  getMyNetwork,
  deactivateAccount,
};

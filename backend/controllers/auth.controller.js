const { aysncHandler } = require("../utils/aysncHandler");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const {
  BadRequestException,
  UnauthorizedAccess,
  NotFoundException,
} = require("../libs/errorExceptionSchema");
const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const { onSuccess } = require("../libs/responseWrapper");
const errorMessages = require("../libs/errorMessages");
const successMessages = require("../libs/successMessages");
const {
  sendRegisterOtpEmail,
  sendPasswordResetOtpEmail,
} = require("../utils/emailService");
const { MEMBERSHIP_TIERS } = require("../constants");

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new BadRequestException(errorMessages.USER_NOT_FOUND);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { refreshToken, accessToken };
};

const generateReferralCode = (fullname) => {
  const prefix = (fullname || "USER")
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 5)
    .toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix || "VIAJE"}-${random}`;
};

/**
 * Step 1 of Signup:
 * Validates details, checks if email/username is taken,
 * Generates 6-digit OTP and sends it to the user's email.
 */
const signupUser = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const {
    fullname,
    email,
    password,
    username,
    phone,
    country,
    city,
    referralCode: refCodeInput,
  } = req.body;

  const normalizedEmail = email.toLowerCase().trim();
  const finalUsername = (
    username ||
    normalizedEmail.split("@")[0] + Math.floor(100 + Math.random() * 900)
  )
    .toLowerCase()
    .trim();

  // Check unique email and username in database
  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    return next(new BadRequestException(errorMessages.EMAIL_ALREADY_EXIST));
  }
  const existingUsername = await User.findOne({ username: finalUsername });
  if (existingUsername) {
    return next(new BadRequestException(errorMessages.USERNAME_ALREADY_EXIST));
  }

  // Generate 6-digit OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Save or update pending registration OTP record
  await Otp.findOneAndUpdate(
    { email: normalizedEmail, type: "register" },
    {
      email: normalizedEmail,
      otp: otpCode,
      type: "register",
      payload: {
        fullname: fullname.trim(),
        email: normalizedEmail,
        password,
        username: finalUsername,
        phone: phone ? phone.trim() : undefined,
        country: country || "República Dominicana",
        city: city || "Santo Domingo",
        referralCode: refCodeInput ? refCodeInput.toUpperCase().trim() : null,
      },
      expiresAt,
    },
    { upsert: true, new: true }
  );

  // Detect language
  const lang = req.headers["x-language"] || req.headers["accept-language"] || "es";

  // Send OTP Email via Gmail SMTP
  sendRegisterOtpEmail(normalizedEmail, otpCode, fullname.trim(), lang).catch(
    (err) => console.error("Register OTP email error:", err.message)
  );

  return res.status(200).json(
    onSuccess(successMessages.OTP_SENT, {
      email: normalizedEmail,
      requiresOtp: true,
      expiresInMinutes: 15,
    })
  );
});

/**
 * Step 2 of Signup:
 * Verifies 6-digit OTP. If matched, registers user into MongoDB,
 * assigns referral upline, generates JWT tokens, and returns active session.
 */
const verifyRegisterOtp = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { email, otp } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const cleanOtp = (otp || "").toString().trim();

  // Find OTP record
  const otpRecord = await Otp.findOne({
    email: normalizedEmail,
    type: "register",
    otp: cleanOtp,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord || !otpRecord.payload) {
    return next(new BadRequestException(errorMessages.INVALID_OR_EXPIRED_OTP));
  }

  const payload = otpRecord.payload;

  // Check again for unique email
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    await Otp.deleteOne({ _id: otpRecord._id });
    return next(new BadRequestException(errorMessages.EMAIL_ALREADY_EXIST));
  }

  // Handle upline / referral connection
  let referredByUser = null;
  let uplineChain = [];

  if (payload.referralCode) {
    referredByUser = await User.findOne({
      referralCode: payload.referralCode,
      status: "active",
    });

    if (referredByUser) {
      uplineChain = [
        referredByUser._id,
        ...(referredByUser.upline || []).slice(0, 4),
      ];
    }
  }

  // Generate unique personal referral code for the user
  let personalReferralCode = generateReferralCode(payload.fullname);
  while (await User.findOne({ referralCode: personalReferralCode })) {
    personalReferralCode = generateReferralCode(payload.fullname);
  }

  // Create user in MongoDB with email already verified
  const user = await User.create({
    fullname: payload.fullname,
    email: payload.email,
    username: payload.username,
    password: payload.password,
    phone: payload.phone,
    country: payload.country,
    city: payload.city,
    referralCode: personalReferralCode,
    referredBy: referredByUser ? referredByUser._id : null,
    upline: uplineChain,
    membershipId: MEMBERSHIP_TIERS.MEMBER,
    isEmailVerified: true,
  });

  // Delete used OTP record
  await Otp.deleteOne({ _id: otpRecord._id });

  // Generate tokens
  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -resetPasswordToken"
  );

  const userData = {
    user: createdUser,
    accessToken,
    refreshToken,
  };

  return res
    .status(201)
    .json(onSuccess(successMessages.USER_REGISTERED, userData));
});

/**
 * Resend Registration OTP
 */
const resendRegisterOtp = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const otpRecord = await Otp.findOne({
    email: normalizedEmail,
    type: "register",
  });

  if (!otpRecord || !otpRecord.payload) {
    return next(
      new BadRequestException(errorMessages.PENDING_REGISTRATION_NOT_FOUND)
    );
  }

  // Generate new OTP
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  otpRecord.otp = newOtp;
  otpRecord.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await otpRecord.save();

  const lang = req.headers["x-language"] || req.headers["accept-language"] || "es";
  sendRegisterOtpEmail(
    normalizedEmail,
    newOtp,
    otpRecord.payload.fullname,
    lang
  ).catch((err) => console.error("Resend OTP email error:", err.message));

  return res.status(200).json(onSuccess(successMessages.OTP_SENT, { email: normalizedEmail }));
});

/**
 * Normal Login
 */
const signinUser = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { identifier, password } = req.body;
  const cleanIdentifier = identifier.toLowerCase().trim();

  const user = await User.findOne({
    $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }],
    status: "active",
  });

  if (!user) {
    return next(
      new BadRequestException(errorMessages.EMAIL_OR_USERNAME_NOT_FOUND)
    );
  }

  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    return next(new BadRequestException(errorMessages.PASSWORD_NOT_CORRECT));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -resetPasswordToken"
  );

  const userData = {
    user: loggedInUser,
    accessToken,
    refreshToken,
  };

  return res.status(200).json(onSuccess(successMessages.USER_LOGIN, userData));
});

const refreshAccessToken = aysncHandler(async (req, res, next) => {
  const incomingToken = req.body.refreshToken;
  if (!incomingToken) {
    return next(new BadRequestException(errorMessages.INVALID_REFRESH_TOKEN));
  }

  let decoded;
  try {
    decoded = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET || "travel_agency_refresh_token_secret_ultra_secure_key_2026_refresh!"
    );
  } catch (err) {
    return next(new UnauthorizedAccess(errorMessages.REFRESH_TOKEN_EXPIRED));
  }

  const user = await User.findById(decoded?._id);
  if (!user || user.status !== "active") {
    return next(new UnauthorizedAccess(errorMessages.UNAUTHORIZED_ACCESS));
  }

  if (incomingToken !== user.refreshToken) {
    return next(new UnauthorizedAccess(errorMessages.REFRESH_TOKEN_EXPIRED));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const dataToSend = {
    accessToken,
    refreshToken,
  };

  return res
    .status(200)
    .json(onSuccess(successMessages.REFRESHTOKEN_UPDATED, dataToSend));
});

const logoutUser = aysncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  return res.status(200).json(onSuccess(successMessages.USER_LOGOUT, {}));
});

const getCurrentUser = aysncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken -emailVerificationToken -resetPasswordToken"
  );
  return res
    .status(200)
    .json(onSuccess(successMessages.CURRENT_USER, user));
});

/**
 * Step 1 of Forgot Password:
 * Generates 6-digit OTP code and sends it to user's email.
 */
const forgotPassword = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
    status: "active",
  });

  if (!user) {
    return next(new BadRequestException(errorMessages.NO_ACCOUNT_WITH_EMAIL));
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Save OTP record for forgot_password
  await Otp.findOneAndUpdate(
    { email: normalizedEmail, type: "forgot_password" },
    {
      email: normalizedEmail,
      otp: otpCode,
      type: "forgot_password",
      expiresAt,
    },
    { upsert: true, new: true }
  );

  const lang = req.headers["x-language"] || req.headers["accept-language"] || "es";
  sendPasswordResetOtpEmail(user.email, otpCode, user.fullname, lang).catch((err) =>
    console.error("Reset OTP email error:", err.message)
  );

  return res
    .status(200)
    .json(onSuccess(successMessages.FORGOT_PASSWORD_OTP_SENT, { email: normalizedEmail }));
});

/**
 * Step 2 of Forgot Password:
 * Verifies 6-digit OTP code and updates password in database.
 */
const resetPassword = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { email, otp, newPassword } = req.body;
  const normalizedEmail = (email || "").toLowerCase().trim();
  const cleanOtp = (otp || "").toString().trim();

  const otpRecord = await Otp.findOne({
    email: normalizedEmail,
    type: "forgot_password",
    otp: cleanOtp,
    expiresAt: { $gt: new Date() },
  });

  if (!otpRecord) {
    return next(
      new BadRequestException(errorMessages.INVALID_OR_EXPIRED_OTP)
    );
  }

  const user = await User.findOne({
    email: normalizedEmail,
    status: "active",
  });

  if (!user) {
    return next(new NotFoundException(errorMessages.USER_NOT_FOUND));
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  // Delete used OTP
  await Otp.deleteOne({ _id: otpRecord._id });

  return res
    .status(200)
    .json(onSuccess(successMessages.PASSWORD_RESET_SUCCESS, {}));
});

module.exports = {
  signupUser,
  verifyRegisterOtp,
  resendRegisterOtp,
  signinUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};

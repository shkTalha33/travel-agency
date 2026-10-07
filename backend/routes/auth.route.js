const { Router } = require("express");
const {
  signupValidations,
  signinValidations,
  refreshTokenValidations,
  forgotPasswordValidations,
  resetPasswordValidations,
  verifyRegisterOtpValidations,
  resendRegisterOtpValidations,
} = require("../middlewares/validation.middleware");
const {
  duplicateUsername,
  duplicateEmail,
  duplicatePhoneNumber,
} = require("../middlewares/auth.middleware");
const {
  signupUser,
  verifyRegisterOtp,
  resendRegisterOtp,
  signinUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { verifyJwt } = require("../middlewares/verifyJwt");
const { authLimiter } = require("../middlewares/rateLimiter");

const router = Router();

// Registration with Email OTP
router.route("/signup").post(
  authLimiter,
  duplicateEmail,
  duplicateUsername,
  duplicatePhoneNumber,
  signupValidations,
  signupUser
);

router.route("/verify-register-otp").post(
  authLimiter,
  verifyRegisterOtpValidations,
  verifyRegisterOtp
);

router.route("/resend-register-otp").post(
  authLimiter,
  resendRegisterOtpValidations,
  resendRegisterOtp
);

// Login & Token Management
router.route("/signin").post(
  authLimiter,
  signinValidations,
  signinUser
);

router.route("/refresh-token").post(
  refreshTokenValidations,
  refreshAccessToken
);

router.route("/logout").post(
  verifyJwt,
  logoutUser
);

router.route("/me").get(
  verifyJwt,
  getCurrentUser
);

// Forgot & Reset Password with Email OTP
router.route("/forgot-password").post(
  authLimiter,
  forgotPasswordValidations,
  forgotPassword
);

router.route("/reset-password").post(
  authLimiter,
  resetPasswordValidations,
  resetPassword
);

module.exports = router;

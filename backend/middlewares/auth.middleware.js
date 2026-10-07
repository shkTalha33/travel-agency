const { BadRequestException, ForbiddenException } = require("../libs/errorExceptionSchema");
const errorMessages = require("../libs/errorMessages");
const User = require("../models/user.model");

const duplicateEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next();

  const existedEmail = await User.findOne({
    email: email.toLowerCase().trim(),
  });
  if (existedEmail && String(existedEmail._id) !== String(req.user?._id)) {
    return next(new BadRequestException(errorMessages.EMAIL_ALREADY_EXIST));
  }
  next();
};

const duplicateUsername = async (req, res, next) => {
  const { username } = req.body;
  if (!username) return next();

  const existedUsername = await User.findOne({
    username: username.toLowerCase().trim(),
  });
  if (
    existedUsername &&
    String(existedUsername._id) !== String(req.user?._id)
  ) {
    return next(new BadRequestException(errorMessages.USERNAME_ALREADY_EXIST));
  }
  next();
};

const duplicatePhoneNumber = async (req, res, next) => {
  const { phone } = req.body;
  if (!phone) return next();

  const existedPhone = await User.findOne({ phone: phone.trim() });
  if (existedPhone && String(existedPhone._id) !== String(req.user?._id)) {
    return next(
      new BadRequestException(errorMessages.PHONE_NUMBER_ALREADY_EXIST)
    );
  }
  next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenException(errorMessages.FORBIDDEN_ACCESS));
    }
    next();
  };
};

module.exports = {
  duplicateUsername,
  duplicateEmail,
  duplicatePhoneNumber,
  requireRole,
};

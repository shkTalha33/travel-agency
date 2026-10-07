const jwt = require("jsonwebtoken");
const { aysncHandler } = require("../utils/aysncHandler");
const {
  UnauthorizedAccess,
  BadRequestException,
} = require("../libs/errorExceptionSchema");
const errorMessages = require("../libs/errorMessages");
const User = require("../models/user.model");

const verifyJwt = aysncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return next(new UnauthorizedAccess(errorMessages.UNAUTHORIZED_ACCESS));
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "travel_agency_access_token_secret_super_secure_key_2026_jwt_token!"
    );

    if (!decodedToken || !decodedToken._id) {
      return next(new UnauthorizedAccess(errorMessages.INVALID_ACCESS_TOKEN));
    }

    const user = await User.findOne({
      _id: decodedToken._id,
      status: "active",
    }).select("-password");

    if (!user) {
      return next(new BadRequestException(errorMessages.USER_NOT_FOUND));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new UnauthorizedAccess(errorMessages.INVALID_ACCESS_TOKEN));
    }
    return next(new UnauthorizedAccess(errorMessages.UNAUTHORIZED_ACCESS));
  }
});

const optionalAuth = aysncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "travel_agency_access_token_secret_super_secure_key_2026_jwt_token!"
    );
    if (decodedToken?._id) {
      const user = await User.findOne({
        _id: decodedToken._id,
        status: "active",
      }).select("-password");
      if (user) req.user = user;
    }
  } catch (_) {
    // Ignore optional auth error
  }
  next();
});

module.exports = { verifyJwt, optionalAuth };

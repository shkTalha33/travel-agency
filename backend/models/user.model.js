const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MEMBERSHIP_TIERS, USER_ROLES, USER_STATUS } = require("../constants");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      minlength: 3,
      index: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
    },
    country: {
      type: String,
      default: "República Dominicana",
      trim: true,
    },
    city: {
      type: String,
      default: "Santo Domingo",
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    },
    membershipId: {
      type: String,
      enum: [...Object.values(MEMBERSHIP_TIERS), "none", null],
      default: function () {
        return this.role === "admin" ? null : MEMBERSHIP_TIERS.MEMBER;
      },
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
      index: true,
    },

    // Referral System
    referralCode: {
      type: String,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    // Ancestor chain for instant upline lookups [Direct Sponsor (L1), Sponsor's Sponsor (L2), ...]
    upline: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Cached fast aggregate points stats (kept updated atomically)
    pointsStats: {
      availablePoints: { type: Number, default: 0, min: 0 },
      totalEarnedPoints: { type: Number, default: 0, min: 0 },
      redeemedPoints: { type: Number, default: 0, min: 0 },
      level1Points: { type: Number, default: 0, min: 0 },
      level2Points: { type: Number, default: 0, min: 0 },
    },

    // Email verification & Password recovery
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },

    // JWT Refresh Token storage
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for fast queries
UserSchema.index({ status: 1, membershipId: 1 });
UserSchema.index({ referredBy: 1, createdAt: -1 });

// Virtual referral link
UserSchema.virtual("referralLink").get(function () {
  const baseUrl = process.env.FRONTEND_URL || "https://viajesdominicana.com";
  return `${baseUrl}/register?ref=${this.referralCode}`;
});

// Hash password and enforce independent admin tier
UserSchema.pre("save", async function (next) {
  if (this.role === "admin") {
    this.membershipId = null;
  }
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
UserSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// Generate Access Token (1 day for admin, 15m default for standard users)
UserSchema.methods.generateAccessToken = function () {
  const isAdmin = this.role === "admin";
  const expiresIn = isAdmin
    ? (process.env.ADMIN_ACCESS_TOKEN_EXPIRY || "1d")
    : (process.env.ACCESS_TOKEN_EXPIRY || "7d");

  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      fullname: this.fullname,
      email: this.email,
      role: this.role,
      membershipId: this.membershipId,
    },
    process.env.ACCESS_TOKEN_SECRET || "travel_agency_access_token_secret_super_secure_key_2026_jwt_token!",
    { expiresIn }
  );
};

// Generate Refresh Token (Longer-lived, e.g. 30d)
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET || "travel_agency_refresh_token_secret_ultra_secure_key_2026_refresh!",
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d" }
  );
};

const User = mongoose.model("User", UserSchema);
module.exports = User;

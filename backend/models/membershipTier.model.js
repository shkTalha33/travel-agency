const mongoose = require("mongoose");

const ALLOWED_CATEGORIES = ["member", "active_member", "ambassador", "elite_ambassador"];

const MembershipTierSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Membership tier category is required"],
      enum: {
        values: ALLOWED_CATEGORIES,
        message: "{VALUE} is not a valid tier category. Must be one of: member, active_member, ambassador, elite_ambassador",
      },
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Tier name is required"],
      trim: true,
    },
    nameEn: {
      type: String,
      trim: true,
    },
    tag: {
      type: String,
      trim: true,
      default: "",
    },
    tagEn: {
      type: String,
      trim: true,
      default: "",
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    subtitleEn: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      default: "Compass",
      trim: true,
    },
    color: {
      type: String,
      default: "#AA303E",
      trim: true,
    },
    level1Rate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    level2Rate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    maxReferralLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 2,
    },
    qualification: {
      type: String,
      default: "",
      trim: true,
    },
    qualificationEn: {
      type: String,
      default: "",
      trim: true,
    },
    perks: {
      type: [String],
      default: [],
    },
    perksEn: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const MembershipTier = mongoose.model("MembershipTier", MembershipTierSchema);

module.exports = {
  MembershipTier,
  ALLOWED_CATEGORIES,
};

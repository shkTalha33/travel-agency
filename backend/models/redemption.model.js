const mongoose = require("mongoose");
const { REDEMPTION_STATUS } = require("../constants");

const RedemptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    points: {
      type: Number,
      required: true,
      min: 50,
    },
    rewardType: {
      type: String,
      default: "travel_credit",
      enum: ["travel_credit", "discount_voucher", "gift_card", "custom"],
    },
    paymentDetails: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(REDEMPTION_STATUS),
      default: REDEMPTION_STATUS.PENDING,
      index: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

RedemptionSchema.index({ userId: 1, createdAt: -1 });

const Redemption = mongoose.model("Redemption", RedemptionSchema);
module.exports = Redemption;

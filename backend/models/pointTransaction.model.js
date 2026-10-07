const mongoose = require("mongoose");
const { TRANSACTION_TYPES } = require("../constants");

const PointTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // The member whose purchase generated this commission (if referral)
    sourceUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sourcePersonName: {
      type: String,
      trim: true,
    },
    sourceOfferId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
    },
    purchaseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
      index: true,
    },
    level: {
      type: Number,
      enum: [1, 2, null],
      default: null,
    },
    points: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "cancelled"],
      default: "completed",
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

PointTransactionSchema.index({ userId: 1, createdAt: -1 });
PointTransactionSchema.index({ userId: 1, type: 1, createdAt: -1 });

const PointTransaction = mongoose.model(
  "PointTransaction",
  PointTransactionSchema
);
module.exports = PointTransaction;

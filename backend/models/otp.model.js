const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["register", "forgot_password"],
      required: true,
      index: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index auto-deletes expired records
    },
  },
  {
    timestamps: true,
  }
);

OtpSchema.index({ email: 1, type: 1 });

const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;

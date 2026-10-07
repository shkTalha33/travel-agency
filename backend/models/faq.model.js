const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "general",
      trim: true,
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
    en: {
      question: { type: String },
      answer: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Faq = mongoose.model("Faq", FaqSchema);
module.exports = Faq;

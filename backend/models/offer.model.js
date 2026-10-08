const mongoose = require("mongoose");

const ItineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    titleEn: { type: String, default: "" },
    description: { type: String, required: true },
    descriptionEn: { type: String, default: "" },
  },
  { _id: false }
);

const OfferSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    titleEn: {
      type: String,
      trim: true,
      default: "",
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    destinationEn: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      default: "República Dominicana",
      trim: true,
    },
    countryEn: {
      type: String,
      default: "Dominican Republic",
      trim: true,
    },
    countryCode: {
      type: String,
      trim: true,
    },
    priceUSD: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    pointsReward: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    durationEn: {
      type: String,
      trim: true,
      default: "",
    },
    hotelCategory: {
      type: String,
      default: "Resort 4 estrellas",
      trim: true,
    },
    hotelCategoryEn: {
      type: String,
      default: "4-Star Resort",
      trim: true,
    },
    badge: {
      type: String,
      trim: true,
      default: "",
    },
    badgeEn: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String,
      },
    ],
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    summaryEn: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionEn: {
      type: String,
      trim: true,
      default: "",
    },
    highlights: [
      {
        type: String,
      },
    ],
    highlightsEn: [
      {
        type: String,
      },
    ],
    included: [
      {
        type: String,
      },
    ],
    includedEn: [
      {
        type: String,
      },
    ],
    notIncluded: [
      {
        type: String,
      },
    ],
    notIncludedEn: [
      {
        type: String,
      },
    ],
    itinerary: [ItineraryDaySchema],
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    en: {
      title: { type: String },
      country: { type: String },
      duration: { type: String },
      hotelCategory: { type: String },
      badge: { type: String },
      summary: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

OfferSchema.index({ isActive: 1, isFeatured: -1, createdAt: -1 });
OfferSchema.index({ destination: "text", title: "text", summary: "text" });

const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;

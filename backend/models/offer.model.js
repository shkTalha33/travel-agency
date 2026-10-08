const mongoose = require("mongoose");

const ItineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
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
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      default: "República Dominicana",
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
    hotelCategory: {
      type: String,
      default: "Resort 4 estrellas",
      trim: true,
    },
    badge: {
      type: String,
      trim: true,
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    highlights: [
      {
        type: String,
      },
    ],
    included: [
      {
        type: String,
      },
    ],
    notIncluded: [
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

const { aysncHandler } = require("../utils/aysncHandler");
const { validationResult } = require("express-validator");
const {
  BadRequestException,
  NotFoundException,
} = require("../libs/errorExceptionSchema");
const Offer = require("../models/offer.model");
const { onSuccess } = require("../libs/responseWrapper");
const errorMessages = require("../libs/errorMessages");
const successMessages = require("../libs/successMessages");

// Slug generator
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const getAllOffers = aysncHandler(async (req, res) => {
  const { search, destination, minPrice, maxPrice, isFeatured, page = 1, limit = 20 } = req.query;

  const filter = { isActive: true };

  if (destination) {
    filter.destination = new RegExp(destination.trim(), "i");
  }

  if (isFeatured !== undefined) {
    filter.isFeatured = isFeatured === "true" || isFeatured === true;
  }

  if (minPrice || maxPrice) {
    filter.priceUSD = {};
    if (minPrice) filter.priceUSD.$gte = Number(minPrice);
    if (maxPrice) filter.priceUSD.$lte = Number(maxPrice);
  }

  if (search) {
    const term = search.trim();
    filter.$or = [
      { title: new RegExp(term, "i") },
      { destination: new RegExp(term, "i") },
      { summary: new RegExp(term, "i") },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [offers, total] = await Promise.all([
    Offer.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Offer.countDocuments(filter),
  ]);

  return res.status(200).json(
    onSuccess(successMessages.FETCH_ALL_OFFERS, {
      offers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  );
});

const getOfferBySlugOrId = aysncHandler(async (req, res, next) => {
  const { idOrSlug } = req.params;

  const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const escaped = idOrSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const filter = isMongoId
    ? {
        $or: [
          { _id: idOrSlug },
          { slug: idOrSlug },
          { slug: idOrSlug.toLowerCase() },
        ],
      }
    : {
        $or: [
          { slug: idOrSlug },
          { slug: idOrSlug.toLowerCase() },
          { id: idOrSlug },
          { slug: new RegExp(`^${escaped}$`, "i") },
        ],
      };

  const offer = await Offer.findOne(filter).lean();
  if (!offer) {
    return next(new NotFoundException(errorMessages.OFFER_NOT_FOUND));
  }

  // Related offers
  const relatedOffers = await Offer.find({
    _id: { $ne: offer._id },
    isActive: true,
  })
    .limit(3)
    .lean();

  return res.status(200).json(
    onSuccess(successMessages.FETCH_SINGLE_OFFER, {
      offer,
      relatedOffers,
    })
  );
});

const createOffer = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const offerData = req.body;
  if (!offerData.slug && offerData.title) {
    offerData.slug = slugify(offerData.title);
  }

  const existingSlug = await Offer.findOne({ slug: offerData.slug });
  if (existingSlug) {
    offerData.slug = `${offerData.slug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const offer = await Offer.create(offerData);

  return res
    .status(201)
    .json(onSuccess(successMessages.OFFER_CREATED, offer));
});

const updateOffer = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  if (updateData.title && !updateData.slug) {
    updateData.slug = slugify(updateData.title);
  }

  const offer = await Offer.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!offer) {
    return next(new NotFoundException(errorMessages.OFFER_NOT_FOUND));
  }

  return res
    .status(200)
    .json(onSuccess(successMessages.OFFER_UPDATED, offer));
});

const deleteOffer = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const offer = await Offer.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!offer) {
    return next(new NotFoundException(errorMessages.OFFER_NOT_FOUND));
  }

  return res
    .status(200)
    .json(onSuccess(successMessages.OFFER_DELETED, {}));
});

module.exports = {
  getAllOffers,
  getOfferBySlugOrId,
  createOffer,
  updateOffer,
  deleteOffer,
};

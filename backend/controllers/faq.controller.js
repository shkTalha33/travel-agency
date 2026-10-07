const { aysncHandler } = require("../utils/aysncHandler");
const { validationResult } = require("express-validator");
const {
  BadRequestException,
  NotFoundException,
} = require("../libs/errorExceptionSchema");
const Faq = require("../models/faq.model");
const { onSuccess } = require("../libs/responseWrapper");
const errorMessages = require("../libs/errorMessages");
const successMessages = require("../libs/successMessages");

const getAllFaqs = aysncHandler(async (req, res) => {
  const faqs = await Faq.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return res
    .status(200)
    .json(onSuccess(successMessages.FETCH_ALL_FAQS, faqs));
});

const createFaq = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const faq = await Faq.create(req.body);
  return res.status(201).json(onSuccess(successMessages.FAQ_CREATED, faq));
});

const updateFaq = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
  if (!faq) {
    return next(new NotFoundException("Pregunta frecuente no encontrada"));
  }
  return res.status(200).json(onSuccess(successMessages.FAQ_UPDATED, faq));
});

const deleteFaq = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const faq = await Faq.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!faq) {
    return next(new NotFoundException("Pregunta frecuente no encontrada"));
  }
  return res.status(200).json(onSuccess(successMessages.FAQ_DELETED, {}));
});

module.exports = {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};

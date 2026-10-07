const { aysncHandler } = require("../utils/aysncHandler");
const { validationResult } = require("express-validator");
const {
  BadRequestException,
  NotFoundException,
} = require("../libs/errorExceptionSchema");
const Contact = require("../models/contact.model");
const { onSuccess } = require("../libs/responseWrapper");
const errorMessages = require("../libs/errorMessages");
const successMessages = require("../libs/successMessages");

const submitContactMessage = aysncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestException(errors.errors[0].msg));
  }

  const { fullname, email, phone, subject, message } = req.body;

  const contact = await Contact.create({
    fullname: fullname.trim(),
    email: email.toLowerCase().trim(),
    phone: phone ? phone.trim() : undefined,
    subject: subject.trim(),
    message: message.trim(),
  });

  return res
    .status(201)
    .json(onSuccess(successMessages.CONTACT_SUBMITTED, contact));
});

const getAllContactsAdmin = aysncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [contacts, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Contact.countDocuments(filter),
  ]);

  return res.status(200).json(
    onSuccess(successMessages.FETCH_ALL_CONTACTS, {
      contacts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  );
});

const updateContactStatusAdmin = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!contact) {
    return next(new NotFoundException(errorMessages.CONTACT_NOT_FOUND));
  }

  return res
    .status(200)
    .json(onSuccess(successMessages.CONTACT_STATUS_UPDATED, contact));
});

module.exports = {
  submitContactMessage,
  getAllContactsAdmin,
  updateContactStatusAdmin,
};

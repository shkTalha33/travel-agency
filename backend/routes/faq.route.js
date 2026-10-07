const { Router } = require("express");
const {
  getAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/faq.controller");
const { faqValidation } = require("../middlewares/validation.middleware");
const { verifyJwt } = require("../middlewares/verifyJwt");
const { requireRole } = require("../middlewares/auth.middleware");
const { USER_ROLES } = require("../constants");

const router = Router();

router.route("/").get(getAllFaqs);

router.route("/").post(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  faqValidation,
  createFaq
);

router.route("/:id").put(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  updateFaq
);

router.route("/:id").delete(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  deleteFaq
);

module.exports = router;

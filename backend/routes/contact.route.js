const { Router } = require("express");
const {
  submitContactMessage,
  getAllContactsAdmin,
  updateContactStatusAdmin,
} = require("../controllers/contact.controller");
const { contactValidations } = require("../middlewares/validation.middleware");
const { verifyJwt } = require("../middlewares/verifyJwt");
const { requireRole } = require("../middlewares/auth.middleware");
const { USER_ROLES } = require("../constants");
const { apiLimiter } = require("../middlewares/rateLimiter");

const router = Router();

router.route("/").post(apiLimiter, contactValidations, submitContactMessage);

router.route("/admin/all").get(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  getAllContactsAdmin
);

router.route("/admin/:id/status").put(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  updateContactStatusAdmin
);

module.exports = router;

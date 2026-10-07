const { Router } = require("express");
const {
  createRedemptionRequest,
  getMyRedemptions,
  getAllRedemptionsAdmin,
  updateRedemptionStatusAdmin,
} = require("../controllers/redemption.controller");
const { redemptionValidation } = require("../middlewares/validation.middleware");
const { verifyJwt } = require("../middlewares/verifyJwt");
const { requireRole } = require("../middlewares/auth.middleware");
const { USER_ROLES } = require("../constants");

const router = Router();

router.use(verifyJwt);

// Member routes
router.route("/request").post(redemptionValidation, createRedemptionRequest);
router.route("/my").get(getMyRedemptions);

// Admin routes
router.route("/admin/all").get(
  requireRole(USER_ROLES.ADMIN),
  getAllRedemptionsAdmin
);

router.route("/admin/:id/status").put(
  requireRole(USER_ROLES.ADMIN),
  updateRedemptionStatusAdmin
);

module.exports = router;

const { Router } = require("express");
const {
  getAllTiers,
  getAvailableCategories,
  getTierById,
  createTier,
  updateTier,
  deleteTier,
} = require("../controllers/membershipTier.controller");
const { verifyJwt } = require("../middlewares/verifyJwt");
const { requireRole } = require("../middlewares/auth.middleware");
const { USER_ROLES } = require("../constants");

const router = Router();

// Public / client routes
router.route("/").get(getAllTiers);
router.route("/available-categories").get(getAvailableCategories);
router.route("/:id").get(getTierById);

// Admin-only management routes
router.route("/").post(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  createTier
);

router.route("/:id").put(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  updateTier
);

router.route("/:id").delete(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  deleteTier
);

module.exports = router;

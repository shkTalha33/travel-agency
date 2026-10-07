const { Router } = require("express");
const {
  getAllOffers,
  getOfferBySlugOrId,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offer.controller");
const { offerValidation } = require("../middlewares/validation.middleware");
const { verifyJwt } = require("../middlewares/verifyJwt");
const { requireRole } = require("../middlewares/auth.middleware");
const { USER_ROLES } = require("../constants");

const router = Router();

// Public routes
router.route("/").get(getAllOffers);
router.route("/:idOrSlug").get(getOfferBySlugOrId);

// Admin-only management routes
router.route("/").post(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  offerValidation,
  createOffer
);

router.route("/:id").put(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  updateOffer
);

router.route("/:id").delete(
  verifyJwt,
  requireRole(USER_ROLES.ADMIN),
  deleteOffer
);

module.exports = router;

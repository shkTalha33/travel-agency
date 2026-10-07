const { Router } = require("express");
const {
  getMyPointsSummary,
  getMyTransactions,
  adminAssignPurchasePoints,
  getAllTransactionsAdmin,
} = require("../controllers/points.controller");
const { assignPointsValidation } = require("../middlewares/validation.middleware");
const { verifyJwt } = require("../middlewares/verifyJwt");
const { requireRole } = require("../middlewares/auth.middleware");
const { USER_ROLES } = require("../constants");

const router = Router();

router.use(verifyJwt);

// Member routes
router.route("/summary").get(getMyPointsSummary);
router.route("/transactions").get(getMyTransactions);

// Admin offline purchase points assignment & upline commission trigger
router.route("/admin/assign-purchase-points").post(
  requireRole(USER_ROLES.ADMIN),
  assignPointsValidation,
  adminAssignPurchasePoints
);

// Admin all transactions history
router.route("/admin/transactions").get(
  requireRole(USER_ROLES.ADMIN),
  getAllTransactionsAdmin
);

module.exports = router;

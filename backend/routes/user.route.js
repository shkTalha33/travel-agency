const { Router } = require("express");
const {
  updateUserDetailsValidations,
  changePasswordValidations,
  changeEmailValidation,
  changeUsernameValidation,
} = require("../middlewares/validation.middleware");
const {
  duplicateUsername,
  duplicateEmail,
} = require("../middlewares/auth.middleware");
const {
  getProfile,
  updateProfile,
  updateAvatar,
  changePassword,
  changeEmail,
  changeUsername,
  getMyNetwork,
  deactivateAccount,
  getAllUsersAdmin,
  updateUserStatusAdmin,
  deleteUserAdmin,
  getAdminDashboardStats,
} = require("../controllers/user.controller");
const { verifyJwt } = require("../middlewares/verifyJwt");
const { requireRole } = require("../middlewares/auth.middleware");
const { USER_ROLES } = require("../constants");

const router = Router();

router.use(verifyJwt);

// Admin endpoints
router.route("/admin/dashboard-stats").get(requireRole(USER_ROLES.ADMIN), getAdminDashboardStats);
router.route("/admin/all").get(requireRole(USER_ROLES.ADMIN), getAllUsersAdmin);
router.route("/admin/:id/status").put(requireRole(USER_ROLES.ADMIN), updateUserStatusAdmin);
router.route("/admin/:id").delete(requireRole(USER_ROLES.ADMIN), deleteUserAdmin);

// Member profile endpoints
router.route("/profile").get(getProfile);
router.route("/update-details").put(updateUserDetailsValidations, updateProfile);
router.route("/update-avatar").put(updateAvatar);
router.route("/update-password").put(changePasswordValidations, changePassword);
router.route("/update-email").put(duplicateEmail, changeEmailValidation, changeEmail);
router.route("/update-username").put(duplicateUsername, changeUsernameValidation, changeUsername);
router.route("/network").get(getMyNetwork);
router.route("/deactivate").put(deactivateAccount);

module.exports = router;

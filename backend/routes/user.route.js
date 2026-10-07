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
} = require("../controllers/user.controller");
const { verifyJwt } = require("../middlewares/verifyJwt");

const router = Router();

router.use(verifyJwt);

router.route("/profile").get(getProfile);
router.route("/update-details").put(updateUserDetailsValidations, updateProfile);
router.route("/update-avatar").put(updateAvatar);
router.route("/update-password").put(changePasswordValidations, changePassword);
router.route("/update-email").put(duplicateEmail, changeEmailValidation, changeEmail);
router.route("/update-username").put(duplicateUsername, changeUsernameValidation, changeUsername);
router.route("/network").get(getMyNetwork);
router.route("/deactivate").put(deactivateAccount);

module.exports = router;

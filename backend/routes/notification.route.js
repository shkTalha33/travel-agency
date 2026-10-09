const { Router } = require("express");
const { verifyJwt } = require("../middlewares/verifyJwt");
const {
  getMyNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = require("../controllers/notification.controller");

const router = Router();

router.use(verifyJwt);

router.route("/")
  .get(getMyNotifications)
  .post(createNotification)
  .delete(clearAllNotifications);

router.route("/read-all").put(markAllAsRead);
router.route("/clear-all").delete(clearAllNotifications);
router.route("/:id/read").put(markAsRead);
router.route("/:id").delete(deleteNotification);

module.exports = router;

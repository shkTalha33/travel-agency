const { Router } = require("express");
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const offerRoutes = require("./offer.route");
const pointsRoutes = require("./points.route");
const redemptionRoutes = require("./redemption.route");
const faqRoutes = require("./faq.route");
const contactRoutes = require("./contact.route");
const uploadRoutes = require("./upload.route");
const membershipTierRoutes = require("./membershipTier.route");
const notificationRoutes = require("./notification.route");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/offers", offerRoutes);
router.use("/points", pointsRoutes);
router.use("/redemptions", redemptionRoutes);
router.use("/faqs", faqRoutes);
router.use("/contact", contactRoutes);
router.use("/upload", uploadRoutes);
router.use("/membership-tiers", membershipTierRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;

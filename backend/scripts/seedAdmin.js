const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { MEMBERSHIP_TIERS, USER_ROLES, USER_STATUS } = require("../constants");

/**
 * Ensures the super admin user exists with required credentials
 */
const seedAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const newAdmin = new User({
        username: "admin",
        fullname: "Administrador General",
        email: adminEmail,
        password: "Admin@12345", // Will be hashed by pre-save hook
        phone: "+1 (809) 555-0100",
        country: "República Dominicana",
        city: "Santo Domingo",
        bio: "Administrador del Sistema de Viajes Dominicana",
        role: USER_ROLES.ADMIN,
        membershipId: MEMBERSHIP_TIERS.ELITE_AMBASSADOR,
        status: USER_STATUS.ACTIVE,
        referralCode: "ADMIN-DOMINICANA",
        isEmailVerified: true,
        pointsStats: {
          availablePoints: 99999,
          totalEarnedPoints: 99999,
          redeemedPoints: 0,
          level1Points: 0,
          level2Points: 0,
        },
      });

      await newAdmin.save();
      console.log("✅ Super Admin seeded successfully: admin@gmail.com / Admin@12345");
    } else {
      // Ensure role is admin and active
      let needsUpdate = false;
      if (existingAdmin.role !== USER_ROLES.ADMIN) {
        existingAdmin.role = USER_ROLES.ADMIN;
        needsUpdate = true;
      }
      if (existingAdmin.status !== USER_STATUS.ACTIVE) {
        existingAdmin.status = USER_STATUS.ACTIVE;
        needsUpdate = true;
      }
      if (!existingAdmin.isEmailVerified) {
        existingAdmin.isEmailVerified = true;
        needsUpdate = true;
      }
      // Check password match, reset if needed
      const isPasswordMatch = await existingAdmin.isPasswordCorrect("Admin@12345");
      if (!isPasswordMatch) {
        existingAdmin.password = "Admin@12345"; // pre-save will hash
        needsUpdate = true;
      }

      if (needsUpdate) {
        await existingAdmin.save();
        console.log("🔄 Super Admin account updated to latest credentials.");
      } else {
        console.log("✨ Super Admin account verified.");
      }
    }
  } catch (error) {
    console.error("⚠️ Error seeding admin account:", error.message);
  }
};

module.exports = seedAdmin;

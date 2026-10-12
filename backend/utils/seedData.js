require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../db");
const User = require("../models/user.model");
const Offer = require("../models/offer.model");
const PointTransaction = require("../models/pointTransaction.model");
const Faq = require("../models/faq.model");
const Redemption = require("../models/redemption.model");
const Contact = require("../models/contact.model");
const Notification = require("../models/notification.model");
const { USER_ROLES } = require("../constants");

const seed = async () => {
  try {
    await connectDB();
    console.log("Seeding Database (Clean Initial Setup)...");

    // Clear existing collections
    await Promise.all([
      Offer.deleteMany({}),
      Faq.deleteMany({}),
      User.deleteMany({}),
      PointTransaction.deleteMany({}),
      Redemption.deleteMany({}),
      Contact.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log(" Cleared collections: Users, Offers, FAQs, PointTransactions, Redemptions, Contacts, Notifications.");

    // Create Initial Admin User
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin2026!";
    const adminUsername = process.env.ADMIN_USERNAME || "admin_viajes";
    const adminFullname = process.env.ADMIN_FULLNAME || "Administrador Viajes Dominicana";

    const adminUser = await User.create({
      fullname: adminFullname,
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: USER_ROLES.ADMIN,
      referralCode: "ADMIN-RD",
      isEmailVerified: true,
      country: "República Dominicana",
      city: "Santo Domingo",
    });

    console.log(" Initial Admin account created successfully:");
    console.log(`  - Username: ${adminUser.username}`);
    console.log(`  - Email:    ${adminUser.email}`);
    console.log(`  - Role:     ${adminUser.role}`);
    console.log("\n Dummy users, mock transactions, sample offers, and sample FAQs have been removed.");
    console.log(" Seed completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error(" Seed failed:", error);
    process.exit(1);
  }
};

seed();

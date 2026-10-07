const mongoose = require("mongoose");
const { DB_NAME } = require("./constants");
const seedAdmin = require("./scripts/seedAdmin");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${DB_NAME}`,
      {
        autoIndex: true, // Auto build indexes in development
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      }
    );
    console.log(
      `\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`
    );
    
    // Auto-seed admin user
    await seedAdmin();
  } catch (error) {
    console.error("MONGODB connection FAILED: ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

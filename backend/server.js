require("dotenv").config();
const { app } = require("./app");
const connectDB = require("./db");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Travel Agency Backend running on port ${PORT}`);
      console.log(`📚 Swagger Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🌐 Base API URL: http://localhost:${PORT}/api/v1`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
  });

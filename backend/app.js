const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./config/swagger");
const errorMessages = require("./libs/errorMessages");
const { onError } = require("./libs/responseWrapper");
const { BadRequestException } = require("./libs/errorExceptionSchema");
const { apiLimiter } = require("./middlewares/rateLimiter");
const v1Router = require("./routes/index");

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI assets
    crossOriginEmbedderPolicy: false,
  })
);

// Compression for optimized fast responses
app.use(compression());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Body Parsers with safe payload limits
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(null, true); // permissive in development
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-language", "X-Language", "Accept-Language"],
  })
);

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Swagger Documentation endpoints
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/v1/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Health check & Info
app.get("/", (req, res) => {
  res.json({
    name: "Viajes Dominicana REST API",
    version: "1.0.0",
    status: "online",
    swaggerDocs: "/api-docs",
    apiPrefix: "/api/v1",
  });
});

// Apply standard API rate limiter
app.use("/api/v1", apiLimiter);

// API v1 Routes
app.use("/api/v1", v1Router);

// 404 handler for unknown routes
app.use((req, res, next) => {
  return next(new BadRequestException(errorMessages.DO_NOT_FOUND_ANY_ROUTE));
});

// Centralized Error Handling Middleware (Format matches Esate-Loop with Multilingual Support)
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  const rawMessage = error.message || errorMessages.AN_UNKNOWN_ERROR_OCCURS;

  // Detect language from headers or query
  const lang = req.headers["x-language"] || req.headers["accept-language"] || req.query.lang || "es";
  const localizedMessage = errorMessages.translate ? errorMessages.translate(rawMessage, lang) : rawMessage;

  if (statusCode === 500 && process.env.NODE_ENV === "development") {
    console.error("ServerError Stack:", error.stack);
  }

  return res.status(statusCode).json(onError(statusCode, localizedMessage));
});

module.exports = { app };

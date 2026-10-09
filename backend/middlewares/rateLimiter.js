const rateLimit = require("express-rate-limit");
const { onError } = require("../libs/responseWrapper");

const isDevelopment = process.env.NODE_ENV !== "production";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 50000 : 1000, // Very generous in dev to prevent local testing lockouts
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for local development or loopback IPs
    if (isDevelopment) return true;
    const ip = req.ip || req.connection.remoteAddress || "";
    return ip === "127.0.0.1" || ip === "::1" || ip === "localhost";
  },
  handler: (req, res) => {
    const lang = req.headers["x-language"] || req.headers["accept-language"] || "es";
    const isEn = typeof lang === "string" && lang.toLowerCase().startsWith("en");
    res
      .status(429)
      .json(
        onError(
          429,
          isEn
            ? "Too many requests from this IP. Please try again later."
            : "Demasiadas solicitudes desde esta IP. Por favor intente más tarde."
        )
      );
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 500 : 30, // Generous in development
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment,
  handler: (req, res) => {
    const lang = req.headers["x-language"] || req.headers["accept-language"] || "es";
    const isEn = typeof lang === "string" && lang.toLowerCase().startsWith("en");
    res
      .status(429)
      .json(
        onError(
          429,
          isEn
            ? "Too many authentication attempts. Please try again in 15 minutes."
            : "Demasiados intentos de autenticación. Por favor intente de nuevo en 15 minutos."
        )
      );
  },
});

module.exports = { apiLimiter, authLimiter };

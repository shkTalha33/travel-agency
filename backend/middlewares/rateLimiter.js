const rateLimit = require("express-rate-limit");
const { onError } = require("../libs/responseWrapper");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .json(
        onError(
          429,
          "Demasiadas solicitudes desde esta IP. Por favor intente más tarde."
        )
      );
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 authentication attempts
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .json(
        onError(
          429,
          "Demasiados intentos de autenticación. Por favor intente de nuevo en 15 minutos."
        )
      );
  },
});

module.exports = { apiLimiter, authLimiter };

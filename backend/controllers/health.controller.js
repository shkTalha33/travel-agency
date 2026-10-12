const mongoose = require("mongoose");
const { onSuccess } = require("../libs/responseWrapper");

/**
 * Controller to get system health status including database connectivity,
 * uptime, environment, and memory consumption.
 */
const getHealthStatus = (req, res) => {
  const dbStateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const formattedUptime = `${hours}h ${minutes}m ${seconds}s`;

  const mem = process.memoryUsage();

  const healthData = {
    status: isDbConnected ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: formattedUptime,
    uptimeSeconds,
    environment: process.env.NODE_ENV || "development",
    services: {
      database: {
        status: dbStateMap[dbState] || "unknown",
        connected: isDbConnected,
        host: mongoose.connection.host || null,
        name: mongoose.connection.name || null,
      },
      api: {
        status: "up",
        version: "1.0.0",
      },
    },
    system: {
      nodeVersion: process.version,
      memory: {
        rss: `${(mem.rss / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      },
    },
  };

  const statusCode = isDbConnected ? 200 : 503;
  return res.status(statusCode).json(onSuccess("System health status", healthData));
};

module.exports = {
  getHealthStatus,
};

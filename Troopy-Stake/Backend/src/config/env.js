const ApiError = require("../utils/ApiError");

const validateEnv = () => {
  const required = ["MONGO_URL", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port)) {
    throw new Error("PORT must be a valid number");
  }

  return {
    port: process.env.PORT || 5000,
    mongoUrl: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY || "1d",
    tigerDbUrl: process.env.TIGER_DATABASE_URL,
    nodeEnv: process.env.NODE_ENV || "development",
  };
};

module.exports = { validateEnv };

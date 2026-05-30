const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    if (user.status === "Inactive" || user.status === "Blocked") {
      throw ApiError.forbidden("Account is inactive or blocked");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(ApiError.unauthorized("Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Token expired"));
    }
    next(error);
  }
};

module.exports = auth;

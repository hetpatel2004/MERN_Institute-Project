const ApiError = require("../utils/ApiError");
const { ROLES } = require("../utils/constants");

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("Insufficient permissions"));
    }

    next();
  };
};

module.exports = authorize;

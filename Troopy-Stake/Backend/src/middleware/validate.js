const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, res, next) => {
  if (!schema) return next();

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return next(ApiError.badRequest("Validation failed", errors));
  }

  next();
};

module.exports = validate;

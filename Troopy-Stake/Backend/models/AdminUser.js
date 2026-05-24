const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    fullName: String,

    username: String,

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: String,

    password: String,

    role: String,

    permissions: {
      type: Object,
      default: {},
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AdminUser",
  adminUserSchema
);
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
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminUser", adminUserSchema);
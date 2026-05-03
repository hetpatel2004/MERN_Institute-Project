const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    HR_name: {
      type: String,
      required: true,
      trim: true,
    },

    contact_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    contact_phone: {
      type: String,
      required: true,
      trim: true,
    },

    job_roles: {
      type: String,
      required: true,
      trim: true,
    },

    package_range: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
const mongoose = require("mongoose");

const companyBranchSchema = new mongoose.Schema(
  {
    branch_name: {
      type: String,
      required: true,
      trim: true,
    },
    admin_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: true }
);

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

    branches: [companyBranchSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
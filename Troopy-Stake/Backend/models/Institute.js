const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    branch_name: {
      type: String,
      required: true,
      trim: true,
    },

    branch_city: {
      type: String,
      required: true,
      trim: true,
    },

    branch_address: {
      type: String,
      required: true,
      trim: true,
    },

    branch_email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    branch_phone: {
      type: String,
      trim: true,
    },

    branch_status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    admin_email: {
      type: String,
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

const instituteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    branches: [branchSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institute", instituteSchema);
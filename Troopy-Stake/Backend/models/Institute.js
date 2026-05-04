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
    admin_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    admin_password: {
      type: String,
      required: true,
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

    // Super / institute admin reference
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Branch data
    branches: [branchSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Institute", instituteSchema);
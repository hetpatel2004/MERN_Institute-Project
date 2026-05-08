const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },

    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);
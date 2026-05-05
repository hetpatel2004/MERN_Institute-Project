const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    },
    branch_id: {   // ✅ ADDED THIS
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    name: {
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
    password: {
      type: String,
      required: true,
    },
    role: {
  type: String,
  enum: [
    "superadmin",
    "instituteadmin",
    "branchadmin",
    "companyadmin",
    "student",
  ],
  required: true,
},
company_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company",
},
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
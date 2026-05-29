const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    branchName: { type: String, required: true, trim: true },
    branchCode: { type: String, required: true, unique: true, trim: true },
    city: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    status: { type: String, enum: ["Active", "Inactive", "Blocked"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", branchSchema);

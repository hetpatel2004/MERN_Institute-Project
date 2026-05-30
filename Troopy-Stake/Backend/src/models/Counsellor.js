const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    ipAddress: { type: String, default: "" },
    device: { type: String, default: "" },
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    loginTime: { type: Date, default: Date.now },
  },
  { _id: false }
);

const counsellorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null },
    branchName: { type: String, default: "", trim: true },
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", default: null },
    status: { type: String, enum: ["Active", "Inactive", "Blocked"], default: "Active" },
    loginInfo: {
      ipAddress: { type: String, default: "" },
      device: { type: String, default: "" },
      location: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
      },
      loginTime: { type: Date, default: null },
    },
    loginHistory: [loginHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Counsellor", counsellorSchema);

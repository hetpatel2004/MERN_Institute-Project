const mongoose = require("mongoose");

const loginApprovalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    loginTime: { type: Date, default: Date.now },
    ipAddress: { type: String, default: "" },
    device: { type: String, default: "" },
    browser: { type: String, default: "" },
    location: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

loginApprovalSchema.index({ userId: 1 });
loginApprovalSchema.index({ status: 1 });

module.exports = mongoose.model("LoginApproval", loginApprovalSchema);

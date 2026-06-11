const mongoose = require("mongoose");

const dailyReportSchema = new mongoose.Schema(
  {
    reportDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    summary: { type: String, default: "" },
    leadsGenerated: { type: Number, default: 0 },
    followUpsDone: { type: Number, default: 0 },
    admissionsDone: { type: Number, default: 0 },
    feesCollected: { type: Number, default: 0 },
    callsMade: { type: Number, default: 0 },
    meetingsHeld: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["Draft", "Submitted", "Approved"], default: "Draft" },
  },
  { timestamps: true }
);

dailyReportSchema.index({ reportDate: -1 });
dailyReportSchema.index({ createdBy: 1 });

module.exports = mongoose.model("DailyReport", dailyReportSchema);

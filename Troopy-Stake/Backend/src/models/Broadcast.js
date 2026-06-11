const mongoose = require("mongoose");

const broadcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    channel: { type: String, enum: ["Email", "WhatsApp", "SMS", "In-App"], required: true },
    targetRoles: [{ type: String }],
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template", default: null },
    scheduledAt: { type: Date, default: null },
    sentAt: { type: Date, default: null },
    status: { type: String, enum: ["Draft", "Scheduled", "Sent", "Failed"], default: "Draft" },
    stats: {
      totalRecipients: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

broadcastSchema.index({ status: 1 });

module.exports = mongoose.model("Broadcast", broadcastSchema);

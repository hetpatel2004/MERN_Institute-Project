const mongoose = require("mongoose");

const holidayNotificationSchema = new mongoose.Schema(
  {
    holidayId: { type: mongoose.Schema.Types.ObjectId, ref: "Holiday", required: true },
    role: { type: String, enum: ["superadmin", "admin", "branchadmin", "counsellor", "faculty", "student", "staff"], required: true },
    message: { type: String, required: true, trim: true },
    sentDate: { type: Date, default: Date.now },
    deliveryStatus: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed"],
      default: "pending",
    },
    notificationMethod: {
      type: String,
      enum: ["in-app", "email", "whatsapp", "sms", "push"],
      default: "in-app",
    },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

holidayNotificationSchema.index({ holidayId: 1, role: 1 });
holidayNotificationSchema.index({ sentDate: -1 });
holidayNotificationSchema.index({ deliveryStatus: 1 });

module.exports = mongoose.model("HolidayNotification", holidayNotificationSchema);

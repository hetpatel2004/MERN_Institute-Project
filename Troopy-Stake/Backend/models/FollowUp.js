const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    relatedType: {
      type: String,
      enum: [
        "User",
        "Student",
        "Branch",
        "Course",
        "Lead",
        "Payment",
        "Booking",
        "Organization",
      ],
      default: "Lead",
    },
    relatedId: {
      type: String,
      default: "",
      trim: true,
    },
    userName: {
      type: String,
      default: "",
      trim: true,
    },
    userEmail: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Overdue"],
      default: "Pending",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      default: "",
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FollowUp", followUpSchema);

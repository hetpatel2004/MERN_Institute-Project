const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "Facebook Ads",
        "Instagram Ads",
        "Google Ads",
        "WhatsApp Campaign",
        "Referral",
        "Walk-in",
        "Email Marketing",
      ],
      required: true,
    },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      default: null,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
    counsellorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counsellor",
      default: null,
    },
    budget: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Active", "Paused", "Completed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);

const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Interested",
        "Follow-up",
        "Admitted",
        "Not Interested",
      ],
      default: "New",
    },

    counsellor: {
      type: String,
      default: "",
      trim: true,
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    preferredBatch: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Warm",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);
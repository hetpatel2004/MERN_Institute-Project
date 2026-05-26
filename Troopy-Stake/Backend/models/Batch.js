const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    batchName: {
      type: String,
      required: true,
      trim: true,
    },
    batchCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    batchType: {
      type: String,
      enum: ["Regular", "Fast Track", "Weekend", "Crash Course"],
      default: "Regular",
    },
    learningMode: {
      type: String,
      enum: ["Offline", "Online", "Hybrid"],
      default: "Offline",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    startDate: String,
    classesPerWeek: Number,
    classDurationMinutes: Number,
    totalClasses: Number,
    holidays: Number,
    startTime: String,
    endTime: String,

    estimatedWeeks: Number,
    estimatedDays: Number,
    estimatedMonths: Number,
    estimatedEndDate: String,

    fee: Number,
    discount: Number,
    registrationFee: Number,
    finalFee: Number,

    maxCapacity: Number,
    minCapacity: Number,

    instructor: String,
    location: String,
    description: String,

    status: {
      type: String,
      enum: ["Upcoming", "Running", "Completed", "Cancelled"],
      default: "Upcoming",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", batchSchema);
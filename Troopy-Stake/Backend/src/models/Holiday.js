const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema(
  {
    holidayName: { type: String, required: true, trim: true },
    holidayDate: { type: Date, required: true },
    holidayType: {
      type: String,
      enum: ["National Holiday", "Festival Holiday", "Company Holiday", "Optional Holiday", "Bank Holiday"],
      required: true,
    },
    description: { type: String, default: "", trim: true },
    reminderDays: { type: Number, default: 1, min: 0, max: 30 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    year: { type: Number, required: true },
    isPreloaded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

holidaySchema.index({ holidayDate: 1 });
holidaySchema.index({ year: 1, holidayType: 1 });
holidaySchema.index({ status: 1, holidayDate: 1 });

module.exports = mongoose.model("Holiday", holidaySchema);

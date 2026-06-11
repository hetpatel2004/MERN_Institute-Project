const mongoose = require("mongoose");

const courseCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    color: { type: String, default: "#4f46e5" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

courseCategorySchema.index({ name: 1 });

module.exports = mongoose.model("CourseCategory", courseCategorySchema);

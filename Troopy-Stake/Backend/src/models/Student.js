const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null },
    studentName: { type: String, required: true, trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    courseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    status: { type: String, enum: ["Active", "Inactive", "Blocked"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);

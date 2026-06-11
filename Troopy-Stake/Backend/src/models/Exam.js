const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program", default: null },
    examDate: { type: Date, default: null },
    duration: { type: String, default: "" },
    totalMarks: { type: Number, default: 0 },
    passingMarks: { type: Number, default: 0 },
    type: { type: String, enum: ["Midterm", "Final", "Quiz", "Assignment", "Practical", "Viva"], default: "Midterm" },
    status: { type: String, enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"], default: "Upcoming" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

examSchema.index({ courseId: 1 });
examSchema.index({ examDate: 1 });

module.exports = mongoose.model("Exam", examSchema);

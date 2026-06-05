const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
    counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    totalFees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    scholarship: { type: Number, default: 0 },
    finalFees: { type: Number, default: 0 },
    registrationFees: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    installmentPlan: { type: String, default: "" },
    dueDate: { type: Date, default: null },
    status: { type: String, enum: ["Paid", "Partial", "Pending", "Overdue"], default: "Pending" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

feeSchema.index({ studentId: 1 });
feeSchema.index({ status: 1 });

module.exports = mongoose.model("Fee", feeSchema);

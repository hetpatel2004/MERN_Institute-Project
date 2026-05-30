const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
    paymentType: { type: String, enum: ["Course Purchase", "Student Fees"], default: "Student Fees" },
    amount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["Paid", "Pending", "Partial"], default: "Pending" },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);

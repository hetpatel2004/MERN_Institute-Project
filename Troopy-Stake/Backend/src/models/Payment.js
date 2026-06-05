const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    feeId: { type: mongoose.Schema.Types.ObjectId, ref: "Fee", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Credit Card", "Debit Card", "Bank Transfer", "Cheque"],
      required: true,
    },
    transactionId: { type: String, default: "" },
    receiptNumber: { type: String, unique: true },
    remarks: { type: String, default: "" },
    receiptUpload: { type: String, default: "" },
    collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

paymentSchema.index({ feeId: 1 });
paymentSchema.index({ studentId: 1 });
paymentSchema.index({ receiptNumber: 1 });

module.exports = mongoose.model("Payment", paymentSchema);

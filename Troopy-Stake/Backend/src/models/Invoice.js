const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    feeId: { type: mongoose.Schema.Types.ObjectId, ref: "Fee", default: null },
    counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    amount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
    dueDate: { type: Date, default: null },
    status: { type: String, enum: ["Paid", "Pending", "Overdue", "Cancelled"], default: "Pending" },
    invoiceType: {
      type: String,
      enum: ["Fee", "Installment", "Registration", "Additional Service"],
      default: "Fee",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ studentId: 1 });
invoiceSchema.index({ status: 1 });

module.exports = mongoose.model("Invoice", invoiceSchema);

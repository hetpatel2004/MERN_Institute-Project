const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Office Rent", "Salary", "Electricity", "Internet", "Marketing", "Software", "Hardware", "Maintenance", "Miscellaneous"],
      required: true,
    },
    amount: { type: Number, required: true },
    vendorName: { type: String, default: "", trim: true },
    invoiceNumber: { type: String, default: "", trim: true },
    expenseDate: { type: Date, default: null },
    description: { type: String, default: "", trim: true },
    attachment: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

expenseSchema.index({ category: 1 });
expenseSchema.index({ status: 1 });

module.exports = mongoose.model("Expense", expenseSchema);

const mongoose = require("mongoose");

const instituteCoursePurchaseSchema = new mongoose.Schema(
  {
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    purchaseAmount: { type: Number, default: 0 },
    purchaseDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, default: null },
    status: { type: String, enum: ["Active", "Expired", "Cancelled"], default: "Active" },
    paymentStatus: { type: String, enum: ["Paid", "Pending", "Partial"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstituteCoursePurchase", instituteCoursePurchaseSchema);

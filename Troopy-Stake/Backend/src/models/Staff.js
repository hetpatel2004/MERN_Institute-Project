const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    joiningDate: { type: Date, default: null },
    salary: { type: Number, default: 0 },
    address: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

staffSchema.index({ email: 1 });

module.exports = mongoose.model("Staff", staffSchema);

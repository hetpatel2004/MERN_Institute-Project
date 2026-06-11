const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    companyName: { type: String, default: "" },
    position: { type: String, required: true, trim: true },
    package: { type: Number, default: 0 },
    offerDate: { type: Date, default: null },
    joiningDate: { type: Date, default: null },
    status: { type: String, enum: ["Offered", "Accepted", "Joined", "Declined"], default: "Offered" },
    remarks: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

placementSchema.index({ studentId: 1 });
placementSchema.index({ status: 1 });

module.exports = mongoose.model("Placement", placementSchema);

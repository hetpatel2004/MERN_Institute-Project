const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    admissionId: { type: String, unique: true, required: true },

    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },

    studentName: { type: String, required: true, trim: true },
    fatherName: { type: String, default: "", trim: true },
    motherName: { type: String, default: "", trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    dateOfBirth: { type: Date, default: null },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
      default: "",
    },
    category: { type: String, default: "", trim: true },
    aadhaarNumber: { type: String, default: "", trim: true },
    nationality: { type: String, default: "Indian", trim: true },

    phone: { type: String, required: true, trim: true },
    alternateMobile: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    whatsappNumber: { type: String, default: "", trim: true },
    parentNumbers: [{ type: String, trim: true }],

    addressLine: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    country: { type: String, default: "India", trim: true },
    pincode: { type: String, default: "", trim: true },

    admissionDate: { type: Date, default: Date.now },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null },
    branchName: { type: String, default: "", trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
    courseName: { type: String, default: "", trim: true },
    courseDuration: { type: String, default: "", trim: true },
    batchName: { type: String, default: "", trim: true },
    semesterYear: { type: String, default: "", trim: true },
    admissionCounselor: { type: String, default: "", trim: true },
    referenceSource: { type: String, default: "", trim: true },

    totalFees: { type: Number, default: 0 },
    registrationFees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    scholarship: { type: Number, default: 0 },
    gstTax: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Partial", "Pending", "Refunded"],
      default: "Pending",
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Card", "EMI", ""],
      default: "",
    },
    emiAllowed: { type: Boolean, default: false },
    installmentCount: { type: Number, default: 0 },
    nextInstallmentDate: { type: Date, default: null },

    studentPhoto: { type: String, default: "" },
    documents: [
      {
        name: { type: String, default: "" },
        url: { type: String, default: "" },
      },
    ],

    courseType: { type: String, enum: ["Online", "Offline", "Hybrid", ""], default: "" },
    duration: { type: String, default: "", trim: true },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    trainerFaculty: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled"],
      default: "Pending",
    },
    notes: { type: String, default: "", trim: true },
    createdBy: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

admissionSchema.pre("save", function (next) {
  if (this.paidAmount >= this.totalFees && this.totalFees > 0) {
    this.paymentStatus = "Paid";
  } else if (this.paidAmount > 0 && this.paidAmount < this.totalFees) {
    this.paymentStatus = "Partial";
  } else {
    this.paymentStatus = "Pending";
  }
  this.pendingAmount =
    this.totalFees - this.paidAmount - this.discount - (this.scholarship || 0);
  if (this.pendingAmount < 0) this.pendingAmount = 0;
  next();
});

module.exports = mongoose.model("Admission", admissionSchema);

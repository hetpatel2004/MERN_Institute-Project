const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
  {
    instituteId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    logo: { type: String, default: "" },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: "", trim: true },
    country: { type: String, default: "India", trim: true },
    pincode: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    registrationNumber: { type: String, default: "", trim: true },
    instituteType: { type: String, default: "", trim: true },
    establishedYear: { type: String, default: "", trim: true },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    facilities: [{ type: String, trim: true }],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

instituteSchema.pre("save", async function (next) {
  if (!this.instituteId) {
    const count = await mongoose.model("Institute").countDocuments();
    this.instituteId = `INST${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Institute", instituteSchema);

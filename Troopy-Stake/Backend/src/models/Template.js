const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Email", "WhatsApp", "SMS", "Document"], required: true },
    subject: { type: String, default: "" },
    content: { type: String, required: true },
    variables: [{ type: String }],
    category: { type: String, default: "General" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

templateSchema.index({ type: 1 });

module.exports = mongoose.model("Template", templateSchema);

const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    review: String,
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      default: "online",
    },

    status: {
      type: String,
      enum: ["draft", "published", "inactive"],
      default: "draft",
    },

    duration_value: {
      type: Number,
      default: 0,
    },

    duration_unit: {
      type: String,
      enum: ["day", "week", "month", "year"],
      default: "month",
    },

    short_description: String,

    description: String,

    goals: [String],

    faqs: [faqSchema],

    reviews: [reviewSchema],

    certificate_enabled: {
      type: Boolean,
      default: true,
    },

    base_price: {
      type: Number,
      default: 0,
    },

    registration_fee: {
      type: Number,
      default: 0,
    },

    emi_allowed: {
      type: Boolean,
      default: true,
    },

    default_emi_months: {
      type: Number,
      default: 0,
    },

    min_monthly_emi: {
      type: Number,
      default: 0,
    },

    max_discount_percent: {
      type: Number,
      default: 0,
    },

    tax_percentage: {
      type: Number,
      default: 0,
    },

    max_installments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const courseModuleSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    module_title: {
      type: String,
      required: true,
      trim: true,
    },

    duration_value: {
      type: Number,
      default: 0,
    },

    duration_unit: {
      type: String,
      enum: ["days", "weeks", "months", "years"],
      default: "days",
    },

    topics: [topicSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourseModule", courseModuleSchema);
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: "",
    },
    topics: [topicSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);
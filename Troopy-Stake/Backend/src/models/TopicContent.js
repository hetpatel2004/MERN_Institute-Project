const mongoose = require("mongoose");

const topicContentSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    articles: [{ title: String, description: String, fileUrl: String }],
    videoAssignments: [{ title: String, description: String, videoUrl: String }],
    assignments: [{ title: String, description: String, fileUrl: String }],
    assignmentSolutions: [{ title: String, description: String, fileUrl: String, videoUrl: String }],
    mcqs: [{ question: String, options: [String], correctAnswer: String, marks: Number }],
    faqs: [{ question: String, answer: String }],
    interviewQuestions: [{ question: String, answer: String, type: String }],
    liveLectures: [{ title: String, meetingLink: String, lectureDate: String, lectureTime: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TopicContent", topicContentSchema);
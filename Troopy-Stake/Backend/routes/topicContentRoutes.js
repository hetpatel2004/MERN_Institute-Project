const express = require("express");
const TopicContent = require("../models/TopicContent");

const router = express.Router();

router.get("/:topicId", async (req, res) => {
  try {
    let content = await TopicContent.findOne({ topicId: req.params.topicId });

    if (!content) {
      content = await TopicContent.create({ topicId: req.params.topicId });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch topic content",
      error: error.message,
    });
  }
});

router.put("/:topicId/:section", async (req, res) => {
  try {
    const allowedSections = [
      "articles",
      "videoAssignments",
      "assignments",
      "assignmentSolutions",
      "mcqs",
      "faqs",
      "interviewQuestions",
      "liveLectures",
    ];

    const { topicId, section } = req.params;

    if (!allowedSections.includes(section)) {
      return res.status(400).json({ message: "Invalid section name" });
    }

    const content = await TopicContent.findOneAndUpdate(
      { topicId },
      { $push: { [section]: req.body } },
      { new: true, upsert: true }
    );

    res.json(content);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add content",
      error: error.message,
    });
  }
});

module.exports = router;
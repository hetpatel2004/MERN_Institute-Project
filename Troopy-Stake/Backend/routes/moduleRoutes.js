const express = require("express");
const Module = require("../models/Module");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const modules = await Module.find()
      .populate("courseId")
      .sort({ createdAt: -1 });

    res.json(modules);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch modules",
      error: error.message,
    });
  }
});

router.get("/course/:courseId", async (req, res) => {
  try {
    const modules = await Module.find({
      courseId: req.params.courseId,
    }).sort({ createdAt: 1 });

    res.json(modules);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch course modules",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { courseId, title, description } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({
        message: "Course and module title are required",
      });
    }

    const module = await Module.create({
      courseId,
      title,
      description,
    });

    res.status(201).json({
      message: "Module created successfully",
      module,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create module",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, description } = req.body;

    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
      },
      { new: true }
    );

    if (!updatedModule) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    res.json({
      message: "Module updated successfully",
      module: updatedModule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update module",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);

    if (!deletedModule) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    res.json({
      message: "Module deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete module",
      error: error.message,
    });
  }
});

router.post("/:moduleId/topics", async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Topic title and description are required",
      });
    }

    const module = await Module.findById(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    module.topics.push({
      title,
      description,
      duration: duration || "",
    });

    await module.save();

    res.status(201).json({
      message: "Topic added successfully",
      module,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add topic",
      error: error.message,
    });
  }
});

router.delete("/:moduleId/topics/:topicId", async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    module.topics = module.topics.filter(
      (topic) => topic._id.toString() !== req.params.topicId
    );

    await module.save();

    res.json({
      message: "Topic deleted successfully",
      module,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete topic",
      error: error.message,
    });
  }
});

// ─── Topic sub-item routes ──────────────────────────────────────

const validSubItemTypes = [
  "articles", "videoAssignments", "assignments", "assignmentSolutions",
  "mcqs", "faqs", "interviewQuestions", "liveLectures",
];

// GET /topic/:topicId — fetch single topic with all sub-items
router.get("/topic/:topicId", async (req, res) => {
  try {
    const mod = await Module.findOne(
      { "topics._id": req.params.topicId },
      { "topics.$": 1 }
    );

    if (!mod || !mod.topics || !mod.topics[0]) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(mod.topics[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch topic", error: error.message });
  }
});

// POST /topic/:topicId/:type — add sub-item to topic
router.post("/topic/:topicId/:type", async (req, res) => {
  try {
    const { type } = req.params;
    if (!validSubItemTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid sub-item type" });
    }

    if (type === "mcqs") {
      const { question, options, explanation } = req.body;
      if (!question || !options) {
        return res.status(400).json({ message: "Question and options are required" });
      }
    } else if (type === "faqs") {
      const { question, answer } = req.body;
      if (!question || !answer) {
        return res.status(400).json({ message: "Question and answer are required" });
      }
    } else {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
    }

    const setKey = `topics.$.${type}`;
    const mod = await Module.findOneAndUpdate(
      { "topics._id": req.params.topicId },
      { $push: { [setKey]: req.body } },
      { new: true, runValidators: true }
    );

    if (!mod) return res.status(404).json({ message: "Topic not found" });

    const topic = mod.topics.id(req.params.topicId);
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: "Failed to add item", error: error.message });
  }
});

// DELETE /topic/:topicId/:type/:itemId — remove sub-item
router.delete("/topic/:topicId/:type/:itemId", async (req, res) => {
  try {
    const { type } = req.params;
    if (!validSubItemTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid sub-item type" });
    }

    const mod = await Module.findOneAndUpdate(
      { "topics._id": req.params.topicId },
      { $pull: { [`topics.$.${type}`]: { _id: req.params.itemId } } },
      { new: true }
    );

    if (!mod) return res.status(404).json({ message: "Topic not found" });

    const topic = mod.topics.id(req.params.topicId);
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error: error.message });
  }
});

// PUT /topic/:topicId/:type/:itemId — update sub-item
router.put("/topic/:topicId/:type/:itemId", async (req, res) => {
  try {
    const { type } = req.params;
    if (!validSubItemTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid sub-item type" });
    }

    const updates = {};
    for (const [key, value] of Object.entries(req.body)) {
      updates[`topics.$.${type}.$[elem].${key}`] = value;
    }

    const mod = await Module.findOneAndUpdate(
      { "topics._id": req.params.topicId },
      { $set: updates },
      { arrayFilters: [{ "elem._id": req.params.itemId }], new: true, runValidators: true }
    );

    if (!mod) return res.status(404).json({ message: "Topic not found" });

    const topic = mod.topics.id(req.params.topicId);
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error: error.message });
  }
});

module.exports = router;
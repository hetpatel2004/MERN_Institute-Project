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

router.post("/", async (req, res) => {
  try {
    const { courseId, title, duration } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({
        message: "Course and module title are required",
      });
    }

    const module = await Module.create({
      courseId,
      title,
      duration,
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

router.post("/:moduleId/topics", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Topic title is required",
      });
    }

    const module = await Module.findById(req.params.moduleId);

    if (!module) {
      return res.status(404).json({
        message: "Module not found",
      });
    }

    module.topics.push({ title });
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

module.exports = router;
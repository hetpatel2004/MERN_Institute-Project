const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      message: "Course Created",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1,
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Failed",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Update Failed",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete Failed",
      error: error.message,
    });
  }
});

module.exports = router;
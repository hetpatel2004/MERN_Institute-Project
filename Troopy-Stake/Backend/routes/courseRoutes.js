const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      type,
      status,
      tagline,
      thumbnail,
      teaserVideoUrl,
      duration,
      price,
    } = req.body;

    if (!title || !slug || !type) {
      return res.status(400).json({
        message: "Title, slug and type are required",
      });
    }

    const course = await Course.create({
      title,
      slug,
      type,
      status: status || "Draft",
      tagline: tagline || "",
      thumbnail: thumbnail || "",
      teaserVideoUrl: teaserVideoUrl || "",
      duration: duration || "",
      price: Number(price) || 0,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log("COURSE CREATE ERROR:", error);
    res.status(500).json({
      message: "Course create failed",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: "Course fetch failed",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({
      message: "Course fetch failed",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({
      message: "Course update failed",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Course delete failed",
      error: error.message,
    });
  }
});

module.exports = router;
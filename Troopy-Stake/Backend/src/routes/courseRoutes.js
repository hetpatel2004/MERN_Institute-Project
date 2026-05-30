const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Course = require("../models/Course");

const router = express.Router();

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "teaserVideo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const data = req.body;

      const course = await Course.create({
        title: data.title,
        slug: data.slug,
        type: data.type,
        status: data.status || "Draft",
        tagline: data.tagline || "",
        durationValue: data.durationValue || "",
        durationType: data.durationType || "Month",
        duration: data.duration || "",
        price: Number(data.price) || 0,

        thumbnail: req.files?.thumbnail
          ? `/uploads/${req.files.thumbnail[0].filename}`
          : data.thumbnailUrl || "",

        teaserVideoUrl: req.files?.teaserVideo
          ? `/uploads/${req.files.teaserVideo[0].filename}`
          : data.teaserVideoUrl || "",
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
  }
);

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
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({
      message: "Course fetch failed",
      error: error.message,
    });
  }
});

router.put(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "teaserVideo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const data = req.body;

      const oldCourse = await Course.findById(req.params.id);

      if (!oldCourse) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      const updateData = {
        title: data.title,
        slug: data.slug,
        type: data.type,
        status: data.status || "Draft",
        tagline: data.tagline || "",
        durationValue: data.durationValue || "",
        durationType: data.durationType || "Month",
        duration: data.duration || "",
        price: Number(data.price) || 0,

        thumbnail: data.thumbnailUrl || oldCourse.thumbnail || "",
        teaserVideoUrl: data.teaserVideoUrl || oldCourse.teaserVideoUrl || "",
      };

      if (req.files?.thumbnail) {
        updateData.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }

      if (req.files?.teaserVideo) {
        updateData.teaserVideoUrl = `/uploads/${req.files.teaserVideo[0].filename}`;
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      console.log("COURSE UPDATE ERROR:", error);
      res.status(500).json({
        message: "Course update failed",
        error: error.message,
      });
    }
  }
);

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({
      message: "Course status updated",
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Status update failed",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Course delete failed",
      error: error.message,
    });
  }
});

module.exports = router;
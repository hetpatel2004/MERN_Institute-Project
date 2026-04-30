const router = require("express").Router();
const Course = require("../models/Course");

// Add Course
router.post("/", async (req, res) => {
  const data = new Course(req.body);
  await data.save();
  res.json(data);
});

// Get Courses
router.get("/", async (req, res) => {
  const data = await Course.find();
  res.json(data);
});

module.exports = router;
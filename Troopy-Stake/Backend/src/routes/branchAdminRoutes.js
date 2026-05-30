const express = require("express");
const router = express.Router();

router.get("/dashboard", async (req, res) => {
  res.json({
    totalStudents: 120,
    totalFaculty: 20,
    totalCourses: 6,
  });
});

module.exports = router;
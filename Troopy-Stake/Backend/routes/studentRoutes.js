const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { instituteId, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (instituteId) filter.instituteId = instituteId;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ studentName: regex }, { email: regex }, { phone: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ students, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

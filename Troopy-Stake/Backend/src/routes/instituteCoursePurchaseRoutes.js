const express = require("express");
const InstituteCoursePurchase = require("../models/InstituteCoursePurchase");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { instituteId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (instituteId) filter.instituteId = instituteId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await InstituteCoursePurchase.countDocuments(filter);
    const purchases = await InstituteCoursePurchase.find(filter)
      .populate("courseId", "title slug type price")
      .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ purchases, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const purchase = await InstituteCoursePurchase.create(req.body);
    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

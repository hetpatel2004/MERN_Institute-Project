const express = require("express");
const Payment = require("../models/Payment");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { instituteId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (instituteId) filter.instituteId = instituteId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ payments, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

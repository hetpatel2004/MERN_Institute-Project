const router = require("express").Router();
const Institute = require("../models/Institute");

// Add Institute
router.post("/", async (req, res) => {
  const data = new Institute(req.body);
  await data.save();
  res.json(data);
});

// Get Institutes
router.get("/", async (req, res) => {
  const data = await Institute.find();
  res.json(data);
});

module.exports = router;
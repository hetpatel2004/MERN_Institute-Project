const express = require("express");
const Batch = require("../models/Batch");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch batches", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: "Failed to create batch", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch batch", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: "Failed to update batch", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete batch", error: error.message });
  }
});

module.exports = router;
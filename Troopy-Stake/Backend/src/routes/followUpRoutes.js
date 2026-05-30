const express = require("express");
const FollowUp = require("../models/FollowUp");

const router = express.Router();

// GET stats (summary counts)
router.get("/stats", async (req, res) => {
  try {
    const [total, pending, inProgress, completed, overdue] =
      await Promise.all([
        FollowUp.countDocuments(),
        FollowUp.countDocuments({ status: "Pending" }),
        FollowUp.countDocuments({ status: "In Progress" }),
        FollowUp.countDocuments({ status: "Completed" }),
        FollowUp.countDocuments({ status: "Overdue" }),
      ]);

    res.status(200).json({ total, pending, inProgress, completed, overdue });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
});

// GET all follow-ups with search, filter, pagination
router.get("/", async (req, res) => {
  try {
    const {
      search,
      status,
      relatedType,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (relatedType) {
      filter.relatedType = relatedType;
    }

    if (dateFrom || dateTo) {
      filter.followUpDate = {};
      if (dateFrom) filter.followUpDate.$gte = new Date(dateFrom);
      if (dateTo) filter.followUpDate.$lte = new Date(dateTo);
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { title: regex },
        { userName: regex },
        { userEmail: regex },
        { description: regex },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await FollowUp.countDocuments(filter);
    const followUps = await FollowUp.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      followUps,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch follow-ups",
      error: error.message,
    });
  }
});

// GET single follow-up
router.get("/:id", async (req, res) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);

    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    res.status(200).json(followUp);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch follow-up",
      error: error.message,
    });
  }
});

// CREATE follow-up
router.post("/", async (req, res) => {
  try {
    const followUp = await FollowUp.create(req.body);
    res.status(201).json(followUp);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create follow-up",
      error: error.message,
    });
  }
});

// UPDATE follow-up
router.put("/:id", async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    res.status(200).json(followUp);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update follow-up",
      error: error.message,
    });
  }
});

// DELETE follow-up
router.delete("/:id", async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndDelete(req.params.id);

    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    res.status(200).json({ message: "Follow-up deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete follow-up",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const Lead = require("../models/Lead");
const FollowUp = require("../models/FollowUp");

const router = express.Router();

const syncFollowUp = async (lead) => {
  try {
    const existing = await FollowUp.findOne({ relatedId: lead._id.toString(), relatedType: "Lead" });

    if (lead.followUpDate) {
      const followUpData = {
        title: `Follow-up: ${lead.studentName}`,
        description: lead.notes || `Follow-up for lead ${lead.studentName}`,
        relatedType: "Lead",
        relatedId: lead._id.toString(),
        userName: lead.studentName,
        userEmail: lead.email || "",
        status: "Pending",
        followUpDate: lead.followUpDate,
        createdBy: lead.counsellor || "System",
        priority:
          lead.priority === "Hot"
            ? "High"
            : lead.priority === "Warm"
              ? "Medium"
              : "Low",
        note: lead.notes || "",
      };

      if (existing) {
        await FollowUp.findByIdAndUpdate(existing._id, followUpData, { new: true });
      } else {
        await FollowUp.create(followUpData);
      }
    } else if (existing) {
      await FollowUp.findByIdAndDelete(existing._id);
    }
  } catch (err) {
    console.error("FollowUp sync error:", err.message);
  }
};

// GET all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
});

// GET single lead
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
});

// CREATE lead
router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    await syncFollowUp(lead);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create lead",
      error: error.message,
    });
  }
});

// UPDATE lead
router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await syncFollowUp(lead);
    res.status(200).json(lead);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update lead",
      error: error.message,
    });
  }
});

// DELETE lead
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await FollowUp.deleteOne({ relatedId: lead._id.toString(), relatedType: "Lead" });
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete lead",
      error: error.message,
    });
  }
});

module.exports = router;

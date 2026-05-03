const express = require("express");
const Institute = require("../models/Institute");

const router = express.Router();

// ADD institute
router.post("/", async (req, res) => {
  try {
    const { name, code, city, email, phone, status } = req.body;

    if (!name || !code || !city || !email || !phone) {
      return res.status(400).json({
        message: "Name, code, city, email and phone are required",
      });
    }

    const existingInstitute = await Institute.findOne({
      $or: [{ code }, { email }],
    });

    if (existingInstitute) {
      return res.status(400).json({
        message: "Institute code or email already exists",
      });
    }

    const institute = await Institute.create({
      name,
      code,
      city,
      email,
      phone,
      status,
    });

    res.status(201).json({
      message: "Institute added successfully",
      institute,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add institute",
      error: error.message,
    });
  }
});

// GET all institutes
router.get("/", async (req, res) => {
  try {
    const institutes = await Institute.find().sort({ createdAt: -1 });
    res.status(200).json(institutes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch institutes",
      error: error.message,
    });
  }
});

// DELETE institute
router.delete("/:id", async (req, res) => {
  try {
    await Institute.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Institute deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete institute",
      error: error.message,
    });
  }
});

// UPDATE institute
router.put("/:id", async (req, res) => {
  try {
    const updatedInstitute = await Institute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedInstitute) {
      return res.status(404).json({
        message: "Institute not found",
      });
    }

    res.status(200).json({
      message: "Institute updated successfully",
      updatedInstitute,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update institute",
      error: error.message,
    });
  }
});

module.exports = router;
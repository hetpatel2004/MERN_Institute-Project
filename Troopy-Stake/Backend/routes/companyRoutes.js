const express = require("express");
const Company = require("../models/Company");

const router = express.Router();

// ADD company
router.post("/", async (req, res) => {
  try {
    const {
      name,
      HR_name,
      contact_email,
      contact_phone,
      job_roles,
      package_range,
    } = req.body;

    if (
      !name ||
      !HR_name ||
      !contact_email ||
      !contact_phone ||
      !job_roles ||
      !package_range
    ) {
      return res.status(400).json({
        message: "All company fields are required",
      });
    }

    const company = await Company.create({
      name,
      HR_name,
      contact_email,
      contact_phone,
      job_roles,
      package_range,
    });

    res.status(201).json({
      message: "Company added successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add company",
      error: error.message,
    });
  }
});

// GET all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message,
    });
  }
});

// DELETE company
router.delete("/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete company",
      error: error.message,
    });
  }
});

// UPDATE company
router.put("/:id", async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company updated successfully",
      updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update company",
      error: error.message,
    });
  }
});

module.exports = router;
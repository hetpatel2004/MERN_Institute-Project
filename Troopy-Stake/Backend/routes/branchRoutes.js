const express = require("express");
const bcrypt = require("bcryptjs");

const Branch = require("../models/Branch");
const User = require("../models/User");

const router = express.Router();

// CREATE BRANCH + BRANCH ADMIN
router.post("/", async (req, res) => {
  try {
    const {
      institute_id,
      branch_name,
      city,
      address,
      admin_name,
      admin_email,
      admin_password,
      status,
    } = req.body;

    if (
      !institute_id ||
      !branch_name ||
      !city ||
      !address ||
      !admin_name ||
      !admin_email ||
      !admin_password
    ) {
      return res.status(400).json({
        message: "All branch and admin fields are required",
      });
    }

    const existingAdmin = await User.findOne({ email: admin_email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(admin_password, 10);

    const branch = await Branch.create({
      institute_id,
      branch_name,
      city,
      address,
      status,
    });

    const admin = await User.create({
      institute_id,
      branch_id: branch._id,
      name: admin_name,
      email: admin_email,
      password: hashedPassword,
      role: "branchadmin",
      isApproved: true,
    });

    branch.admin_id = admin._id;
    await branch.save();

    res.status(201).json({
      message: "Branch and Branch Admin created successfully",
      branch,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create branch",
      error: error.message,
    });
  }
});

// GET ALL BRANCHES
router.get("/", async (req, res) => {
  try {
    const branches = await Branch.find()
      .populate("institute_id", "name code city")
      .populate("admin_id", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch branches",
      error: error.message,
    });
  }
});

// GET BRANCHES BY INSTITUTE
router.get("/institute/:instituteId", async (req, res) => {
  try {
    const branches = await Branch.find({
      institute_id: req.params.instituteId,
    })
      .populate("admin_id", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch institute branches",
      error: error.message,
    });
  }
});

// DELETE BRANCH
router.delete("/:id", async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    await User.findByIdAndDelete(branch.admin_id);
    await Branch.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Branch and branch admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete branch",
      error: error.message,
    });
  }
});

module.exports = router;
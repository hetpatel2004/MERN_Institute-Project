const express = require("express");
const bcrypt = require("bcryptjs");

const Institute = require("../models/Institute");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, code, city, email, phone, status, branches } = req.body;

    if (!name || !code || !city || !email || !phone) {
      return res.status(400).json({
        message: "Institute details are required",
      });
    }

    const finalBranches = [];

    if (branches && branches.length > 0) {
      for (const branch of branches) {
        if (
          branch.branch_name &&
          branch.branch_city &&
          branch.branch_address &&
          branch.admin_email &&
          branch.admin_password
        ) {
          const existingBranchAdmin = await User.findOne({
            email: branch.admin_email.toLowerCase(),
          });

          if (existingBranchAdmin) {
            return res.status(400).json({
              message: `Branch admin email already exists: ${branch.admin_email}`,
            });
          }

          const hashedPassword = await bcrypt.hash(branch.admin_password, 10);

          const branchAdmin = await User.create({
            name: `${branch.branch_name} Admin`,
            email: branch.admin_email.toLowerCase(),
            password: hashedPassword,
            role: "branchadmin",
            isApproved: true,
          });

          finalBranches.push({
            branch_name: branch.branch_name,
            branch_city: branch.branch_city,
            branch_address: branch.branch_address,
            branch_email: branch.branch_email || "",
            branch_phone: branch.branch_phone || "",
            branch_status: branch.branch_status || "Active",
            admin_email: branch.admin_email.toLowerCase(),
            admin_id: branchAdmin._id,
          });
        }
      }
    }

    const institute = await Institute.create({
      name,
      code,
      city,
      email,
      phone,
      status,
      branches: finalBranches,
    });

    for (const branch of institute.branches) {
      if (branch.admin_id) {
        await User.findByIdAndUpdate(branch.admin_id, {
          institute_id: institute._id,
          branch_id: branch._id,
        });
      }
    }

    const populatedInstitute = await Institute.findById(institute._id).populate(
      "branches.admin_id",
      "name email role loginInfo"
    );

    res.status(201).json({
      message: "Institute created successfully",
      institute: populatedInstitute,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create institute",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const institutes = await Institute.find()
      .populate("branches.admin_id", "name email role loginInfo")
      .sort({ createdAt: -1 });

    res.status(200).json(institutes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch institutes",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, code, city, email, phone, status } = req.body;

    const updatedInstitute = await Institute.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code,
        city,
        email,
        phone,
        status,
      },
      { new: true }
    ).populate("branches.admin_id", "name email role loginInfo");

    res.status(200).json(updatedInstitute);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update institute",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({
        message: "Institute not found",
      });
    }

    if (institute.branches?.length > 0) {
      for (const branch of institute.branches) {
        if (branch.admin_id) {
          await User.findByIdAndDelete(branch.admin_id);
        }
      }
    }

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

module.exports = router;
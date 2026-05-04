const express = require("express");
const bcrypt = require("bcryptjs");

const Institute = require("../models/Institute");
const Branch = require("../models/Branch");
const User = require("../models/User");

const router = express.Router();

// CREATE INSTITUTE + BRANCHES
router.post("/", async (req, res) => {
  try {
    const { name, code, city, email, phone, status, branches } = req.body;

    if (!name || !code || !city || !email || !phone) {
      return res.status(400).json({
        message: "Institute fields are required",
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

    if (branches && branches.length > 0) {
      for (const branch of branches) {
        if (
          branch.branch_name &&
          branch.branch_city &&
          branch.branch_address &&
          branch.admin_email &&
          branch.admin_password
        ) {
          const hashedPassword = await bcrypt.hash(branch.admin_password, 10);

          const branchAdmin = await User.create({
            institute_id: institute._id,
            name: `${branch.branch_name} Admin`,
            email: branch.admin_email,
            password: hashedPassword,
            role: "branchadmin",
            isApproved: true,
          });

          const createdBranch = await Branch.create({
            institute_id: institute._id,
            branch_name: branch.branch_name,
            city: branch.branch_city,
            address: branch.branch_address,
            admin_id: branchAdmin._id,
            status: "Active",
          });

          branchAdmin.branch_id = createdBranch._id;
          await branchAdmin.save();
        }
      }
    }

    res.status(201).json({
      message: "Institute created successfully",
      institute,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create institute",
      error: error.message,
    });
  }
});

// GET ALL INSTITUTES WITH BRANCHES
router.get("/", async (req, res) => {
  try {
    const institutes = await Institute.find().sort({ createdAt: -1 });

    const data = await Promise.all(
      institutes.map(async (institute) => {
        const branches = await Branch.find({
          institute_id: institute._id,
        }).populate("admin_id", "email");

        return {
          ...institute.toObject(),
          branches: branches.map((branch) => ({
            _id: branch._id,
            branch_name: branch.branch_name,
            branch_city: branch.city,
            branch_address: branch.address,
            admin_email: branch.admin_id?.email || "",
            status: branch.status,
          })),
        };
      })
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch institutes",
      error: error.message,
    });
  }
});

// UPDATE INSTITUTE
router.put("/:id", async (req, res) => {
  try {
    const { name, code, city, email, phone, status } = req.body;

    const updatedInstitute = await Institute.findByIdAndUpdate(
      req.params.id,
      { name, code, city, email, phone, status },
      { new: true }
    );

    res.status(200).json(updatedInstitute);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update institute",
      error: error.message,
    });
  }
});

// DELETE INSTITUTE + BRANCHES
router.delete("/:id", async (req, res) => {
  try {
    const branches = await Branch.find({ institute_id: req.params.id });

    for (const branch of branches) {
      if (branch.admin_id) {
        await User.findByIdAndDelete(branch.admin_id);
      }
    }

    await Branch.deleteMany({ institute_id: req.params.id });
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
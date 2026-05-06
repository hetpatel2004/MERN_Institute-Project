const express = require("express");
const bcrypt = require("bcryptjs");

const Institute = require("../models/Institute");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      code,
      city,
      email,
      phone,
      status,
      admin_email,
      admin_password,
      branches,
    } = req.body;

    if (
      !name ||
      !code ||
      !city ||
      !email ||
      !phone ||
      !admin_email ||
      !admin_password
    ) {
      return res.status(400).json({
        message: "Institute and admin fields are required",
      });
    }

    const existingInstituteAdmin = await User.findOne({
      email: admin_email.toLowerCase(),
    });

    if (existingInstituteAdmin) {
      return res.status(400).json({
        message: "Institute admin email already exists",
      });
    }

    const instituteAdminPassword = await bcrypt.hash(admin_password, 10);

    const instituteAdmin = await User.create({
      name: `${name} Admin`,
      email: admin_email.toLowerCase(),
      password: instituteAdminPassword,
      role: "instituteadmin",
      isApproved: true,
    });

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

          const branchPassword = await bcrypt.hash(branch.admin_password, 10);

          const branchAdmin = await User.create({
            name: `${branch.branch_name} Admin`,
            email: branch.admin_email.toLowerCase(),
            password: branchPassword,
            role: "branchadmin",
            isApproved: true,
          });

          finalBranches.push({
            branch_name: branch.branch_name,
            branch_city: branch.branch_city,
            branch_address: branch.branch_address,
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
      admin_email: admin_email.toLowerCase(),
      admin_id: instituteAdmin._id,
      branches: finalBranches,
    });

    instituteAdmin.institute_id = institute._id;
    await instituteAdmin.save();

    for (const branch of institute.branches) {
      await User.findByIdAndUpdate(branch.admin_id, {
        institute_id: institute._id,
        branch_id: branch._id,
      });
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

router.get("/", async (req, res) => {
  try {
    const institutes = await Institute.find()
      .populate("admin_id", "email role loginInfo")
      .populate("branches.admin_id", "email role loginInfo")
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

router.delete("/:id", async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (institute?.admin_id) {
      await User.findByIdAndDelete(institute.admin_id);
    }

    if (institute?.branches?.length > 0) {
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
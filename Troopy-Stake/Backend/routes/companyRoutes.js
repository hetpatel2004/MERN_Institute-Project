const express = require("express");
const bcrypt = require("bcryptjs");

const Company = require("../models/Company");
const User = require("../models/User");

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
      branches,
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
      branches: [],
    });

    let companyBranches = [];

    if (branches && branches.length > 0) {
      for (const branch of branches) {
        if (branch.branch_name && branch.admin_email && branch.admin_password) {
          const existingUser = await User.findOne({
            email: branch.admin_email,
          });

          if (existingUser) {
            return res.status(400).json({
              message: `Company admin email already exists: ${branch.admin_email}`,
            });
          }

          const hashedPassword = await bcrypt.hash(branch.admin_password, 10);

          const companyAdmin = await User.create({
            company_id: company._id,
            name: `${branch.branch_name} Admin`,
            email: branch.admin_email,
            password: hashedPassword,
            role: "companyadmin",
            isApproved: true,
          });

          companyBranches.push({
            branch_name: branch.branch_name,
            admin_email: branch.admin_email,
            admin_id: companyAdmin._id,
          });
        }
      }
    }

    company.branches = companyBranches;
    await company.save();

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
    const companies = await Company.find()
      .populate("branches.admin_id", "email role loginInfo")
      .sort({ createdAt: -1 });

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
    const company = await Company.findById(req.params.id);

    if (company?.branches?.length > 0) {
      for (const branch of company.branches) {
        if (branch.admin_id) {
          await User.findByIdAndDelete(branch.admin_id);
        }
      }
    }

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
    const {
      name,
      HR_name,
      contact_email,
      contact_phone,
      job_roles,
      package_range,
    } = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      {
        name,
        HR_name,
        contact_email,
        contact_phone,
        job_roles,
        package_range,
      },
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
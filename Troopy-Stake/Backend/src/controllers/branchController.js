const bcrypt = require("bcryptjs");
const Branch = require("../models/Branch");
const User = require("../models/User");
const Institute = require("../models/Institute");

exports.getAll = async (req, res) => {
  try {
    const { instituteId, search, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (instituteId) filter.instituteId = instituteId;
    if (status) filter.status = status;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ branchName: regex }, { branchCode: regex }, { city: regex }, { phone: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Branch.countDocuments(filter);
    const branches = await Branch.find(filter)
      .populate("instituteId", "name code city")
      .populate("adminId", "name email phone status loginInfo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const enriched = await Promise.all(
      branches.map(async (b) => {
        const [studentCount, admissionCount, leadCount, counsellorCount] = await Promise.all([
          countModel("Student", { branch_id: b._id }),
          countModel("Admission", { branchId: b._id }),
          countModel("Lead", { branchId: b._id }),
          countModel("Counsellor", { branch: b._id }),
        ]);
        return {
          ...b.toObject(),
          studentCount,
          admissionCount,
          leadCount,
          counsellorCount,
        };
      })
    );

    const allBranches = await Branch.find();
    const activeBranches = allBranches.filter((b) => b.status === "Active").length;
    const branchAdmins = await User.countDocuments({ role: "branchadmin" });

    const totalInstitutes = await Institute.countDocuments();
    const totalStudents = await countModel("Student", {});
    const totalAdmissions = await countModel("Admission", {});
    let totalRevenue = 0;
    try {
      const rev = await require("../models/Admission").aggregate([
        { $group: { _id: null, total: { $sum: "$paidAmount" } } },
      ]);
      totalRevenue = rev.length > 0 ? rev[0].total : 0;
    } catch (_) {}

    res.json({
      branches: enriched,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats: { totalInstitutes, totalBranches: allBranches.length, activeBranches, totalBranchAdmins: branchAdmins, totalStudents, totalAdmissions, totalRevenue },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch branches", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
      .populate("instituteId", "name code city email phone address")
      .populate("adminId", "name email phone status loginInfo loginHistory");

    if (!branch) return res.status(404).json({ message: "Branch not found" });

    const [students, admissions, leads, counsellors, followUps, batches, courses] = await Promise.all([
      findModel("Student", { branch_id: branch._id }),
      findModel("Admission", { branchId: branch._id }),
      findModel("Lead", { branchId: branch._id }),
      findModel("Counsellor", { branch: branch._id }),
      findModel("FollowUp", { branchId: branch._id }),
      findModel("Batch", { branchId: branch._id }),
      findModel("InstituteCoursePurchase", { branchId: branch._id }),
    ]);

    res.json({ branch, students, admissions, leads, counsellors, followUps, batches, courses });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch branch", error: error.message });
  }
};

exports.getByInstitute = async (req, res) => {
  try {
    const branches = await Branch.find({ instituteId: req.params.instituteId })
      .populate("adminId", "name email phone status")
      .sort({ createdAt: -1 });
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch branches", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      instituteId, branchName, branchCode, city, state, address, phone, email,
      adminName, adminEmail, adminPhone, adminPassword, status,
    } = req.body;

    const institute = await Institute.findById(instituteId);
    if (!institute) return res.status(404).json({ message: "Institute not found" });

    const existingCode = await Branch.findOne({ branchCode });
    if (existingCode) return res.status(400).json({ message: "Branch code already exists" });

    if (adminEmail) {
      const existingEmail = await User.findOne({ email: adminEmail.toLowerCase() });
      if (existingEmail) return res.status(400).json({ message: "Admin email already exists" });
    }

    let adminId = null;
    if (adminName && adminEmail && adminPassword) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        phone: adminPhone || "",
        password: hashedPassword,
        role: "branchadmin",
        institute_id: instituteId,
        status: "Active",
      });
      adminId = adminUser._id;
    }

    const branch = await Branch.create({
      instituteId,
      adminId,
      branchName,
      branchCode,
      city: city || "",
      state: state || "",
      address: address || "",
      phone: phone || "",
      email: email || "",
      status: status || "Active",
    });

    if (adminId) {
      await User.findByIdAndUpdate(adminId, { branch_id: branch._id });
    }

    const populated = await Branch.findById(branch._id)
      .populate("instituteId", "name code city")
      .populate("adminId", "name email phone status");

    res.status(201).json({ message: "Branch created successfully", branch: populated });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to create branch", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    const {
      branchName, branchCode, city, state, address, phone, email, status,
    } = req.body;

    if (branchCode && branchCode !== branch.branchCode) {
      const existing = await Branch.findOne({ branchCode });
      if (existing) return res.status(400).json({ message: "Branch code already in use" });
    }

    const updateData = {};
    if (branchName !== undefined) updateData.branchName = branchName;
    if (branchCode !== undefined) updateData.branchCode = branchCode;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (status !== undefined) updateData.status = status;

    const updated = await Branch.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("instituteId", "name code city")
      .populate("adminId", "name email phone status");

    res.json({ message: "Branch updated successfully", branch: updated });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update branch" });
  }
};

exports.remove = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    if (branch.adminId) {
      await User.findByIdAndDelete(branch.adminId);
    }

    await Branch.findByIdAndDelete(req.params.id);
    res.json({ message: "Branch and associated admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete branch", error: error.message });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });

    const statusMap = { Active: "Inactive", Inactive: "Active", Blocked: "Active" };
    branch.status = statusMap[branch.status] || "Active";
    await branch.save();

    if (branch.adminId) {
      await User.findByIdAndUpdate(branch.adminId, { status: branch.status });
    }

    res.json({ message: `Branch ${branch.status.toLowerCase()}`, branch });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ message: "Password must be at least 4 characters" });
    }

    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    if (!branch.adminId) return res.status(400).json({ message: "No admin assigned to this branch" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(branch.adminId, { password: hashedPassword });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password", error: error.message });
  }
};

async function countModel(name, filter) {
  try { return await require(`../models/${name}`).countDocuments(filter); } catch (_) { return 0; }
}

async function findModel(name, filter) {
  try { return await require(`../models/${name}`).find(filter).sort({ createdAt: -1 }).limit(50); } catch (_) { return []; }
}

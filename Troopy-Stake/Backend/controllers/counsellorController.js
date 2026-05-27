const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Counsellor = require("../models/Counsellor");
const Lead = require("../models/Lead");
const FollowUp = require("../models/FollowUp");
const Admission = require("../models/Admission");

const getCounsellorStats = async (counsellorId, name, email) => {
  const query = { $or: [{ counsellor: name }, { counsellor: email }] };
  const assignedLeads = await Lead.countDocuments(query);
  const allLeads = await Lead.find(query);
  const leadIds = allLeads.map((l) => l._id.toString());

  const followUpsDone = await FollowUp.countDocuments({
    relatedId: { $in: leadIds },
    relatedType: "Lead",
    status: "Completed",
  });

  const pendingFollowUps = await FollowUp.countDocuments({
    relatedId: { $in: leadIds },
    relatedType: "Lead",
    status: { $ne: "Completed" },
  });

  const admissionQuery = { $or: [{ convertedBy: name }, { convertedBy: email }] };
  const convertedStudents = await Admission.countDocuments(admissionQuery);

  const revenueResult = await Admission.aggregate([
    { $match: { $or: [{ convertedBy: name }, { convertedBy: email }] } },
    { $group: { _id: null, total: { $sum: "$paidAmount" } } },
  ]);
  const revenueGenerated = revenueResult.length > 0 ? revenueResult[0].total : 0;

  const conversionRate = assignedLeads > 0 ? ((convertedStudents / assignedLeads) * 100).toFixed(1) : "0.0";

  return { assignedLeads, followUpsDone, pendingFollowUps, convertedStudents, conversionRate, revenueGenerated };
};

exports.getAll = async (req, res) => {
  try {
    const { search, status, branch, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (branch) filter.branch = branch;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Counsellor.countDocuments(filter);
    const counsellors = await Counsellor.find(filter)
      .populate("branch", "branchName city")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const enriched = await Promise.all(
      counsellors.map(async (c) => {
        const stats = await getCounsellorStats(c._id, c.name, c.email);
        return {
          ...c.toObject(),
          ...stats,
          branchName: c.branch?.branchName || c.branchName || "N/A",
        };
      })
    );

    const allCounsellors = await Counsellor.find();
    const allStats = await Promise.all(
      allCounsellors.map(async (c) => getCounsellorStats(c._id, c.name, c.email))
    );

    const totalCounsellors = allCounsellors.length;
    const activeCounsellors = allCounsellors.filter((c) => c.status === "Active").length;
    const totalLeadsAssigned = allStats.reduce((s, st) => s + st.assignedLeads, 0);
    const totalAdmissionsConverted = allStats.reduce((s, st) => s + st.convertedStudents, 0);
    const totalRevenue = allStats.reduce((s, st) => s + st.revenueGenerated, 0);
    const overallConversionRate = totalLeadsAssigned > 0
      ? ((totalAdmissionsConverted / totalLeadsAssigned) * 100).toFixed(1)
      : "0.0";

    res.json({
      counsellors: enriched,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats: {
        totalCounsellors,
        activeCounsellors,
        totalLeadsAssigned,
        totalAdmissionsConverted,
        overallConversionRate,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch counsellors", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id).populate("branch", "branchName city address phone");
    if (!counsellor) return res.status(404).json({ message: "Counsellor not found" });

    const stats = await getCounsellorStats(counsellor._id, counsellor.name, counsellor.email);

    const allLeads = await Lead.find({ $or: [{ counsellor: counsellor.name }, { counsellor: counsellor.email }] })
      .sort({ createdAt: -1 });
    const leadIds = allLeads.map((l) => l._id.toString());

    const followUps = await FollowUp.find({ relatedId: { $in: leadIds }, relatedType: "Lead" })
      .sort({ followUpDate: -1 })
      .limit(50);

    const conversions = await Admission.find({
      $or: [{ convertedBy: counsellor.name }, { convertedBy: counsellor.email }],
    }).sort({ createdAt: -1 });

    res.json({
      counsellor: { ...counsellor.toObject(), ...stats },
      leads: allLeads,
      followUps,
      conversions,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch counsellor", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, phone, password, branch, branchName, status, profileImage } = req.body;

    const existing = await Counsellor.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const counsellor = await Counsellor.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      branch: branch || null,
      branchName: branchName || "",
      status: status || "Active",
      profileImage: profileImage || "",
    });

    res.status(201).json({ message: "Counsellor created successfully", counsellor });
  } catch (error) {
    res.status(400).json({ message: "Failed to create counsellor", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const updateData = { ...rest };

    const existing = await Counsellor.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Counsellor not found" });

    if (password && password !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const counsellor = await Counsellor.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Counsellor updated successfully", counsellor });
  } catch (error) {
    res.status(400).json({ message: "Failed to update counsellor", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const counsellor = await Counsellor.findByIdAndDelete(req.params.id);
    if (!counsellor) return res.status(404).json({ message: "Counsellor not found" });
    res.json({ message: "Counsellor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete counsellor", error: error.message });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id);
    if (!counsellor) return res.status(404).json({ message: "Counsellor not found" });

    const statusMap = { Active: "Inactive", Inactive: "Active", Blocked: "Active" };
    counsellor.status = statusMap[counsellor.status] || "Active";
    await counsellor.save();

    res.json({ message: `Counsellor ${counsellor.status.toLowerCase()}`, counsellor });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, device, location } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const counsellor = await Counsellor.findOne({ email: email.toLowerCase() }).populate("branch", "branchName city");
    if (!counsellor) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, counsellor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    if (counsellor.status !== "Active") {
      return res.status(403).json({ message: "Account is not active. Contact Super Admin." });
    }

    const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";

    const loginEntry = {
      ipAddress,
      device: device || req.headers["user-agent"] || "",
      location: location || { latitude: null, longitude: null },
      loginTime: new Date(),
    };

    counsellor.loginInfo = loginEntry;
    counsellor.loginHistory.push(loginEntry);
    await counsellor.save();

    const token = jwt.sign(
      { id: counsellor._id, role: "counsellor", email: counsellor.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      counsellor: {
        id: counsellor._id,
        name: counsellor.name,
        email: counsellor.email,
        phone: counsellor.phone,
        role: "counsellor",
        branch: counsellor.branch,
        branchName: counsellor.branchName,
        profileImage: counsellor.profileImage,
        status: counsellor.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

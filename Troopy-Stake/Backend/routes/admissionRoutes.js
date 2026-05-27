const express = require("express");
const Admission = require("../models/Admission");
const Lead = require("../models/Lead");

const router = express.Router();

const generateAdmissionId = async () => {
  const count = await Admission.countDocuments();
  const year = new Date().getFullYear().toString().slice(-2);
  const num = String(count + 1).padStart(4, "0");
  return `ADM${year}${num}`;
};

const computePayment = (totalFees, paidAmount, discount, scholarship) => {
  const pending = Math.max(0, totalFees - paidAmount - (discount || 0) - (scholarship || 0));
  let paymentStatus = "Pending";
  if (paidAmount >= totalFees && totalFees > 0) paymentStatus = "Paid";
  else if (paidAmount > 0 && paidAmount < totalFees) paymentStatus = "Partial";
  return { paymentStatus, pendingAmount: pending };
};

router.get("/stats", async (req, res) => {
  try {
    const [total, confirmed, pending, cancelled, revenueAgg] =
      await Promise.all([
        Admission.countDocuments(),
        Admission.countDocuments({ status: "Confirmed" }),
        Admission.countDocuments({ status: "Pending" }),
        Admission.countDocuments({ status: "Cancelled" }),
        Admission.aggregate([
          { $match: { status: "Confirmed" } },
          { $group: { _id: null, total: { $sum: "$paidAmount" } } },
        ]),
      ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.status(200).json({
      total,
      confirmed,
      pending,
      cancelled,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      search,
      status,
      paymentStatus,
      branch,
      course,
      gender,
      courseType,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (branch) filter.branchName = branch;
    if (course) filter.courseName = course;
    if (gender) filter.gender = gender;
    if (courseType) filter.courseType = courseType;

    if (dateFrom || dateTo) {
      filter.admissionDate = {};
      if (dateFrom) filter.admissionDate.$gte = new Date(dateFrom);
      if (dateTo) filter.admissionDate.$lte = new Date(dateTo);
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { admissionId: regex },
        { studentName: regex },
        { email: regex },
        { phone: regex },
        { fatherName: regex },
        { aadhaarNumber: regex },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Admission.countDocuments(filter);
    const admissions = await Admission.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      admissions,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admissions", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: "Admission not found" });
    res.status(200).json(admission);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admission", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      totalFees = 0,
      paidAmount = 0,
      discount = 0,
      scholarship = 0,
      ...rest
    } = req.body;

    const { paymentStatus, pendingAmount } = computePayment(totalFees, paidAmount, discount, scholarship);
    const admissionId = await generateAdmissionId();

    const admission = await Admission.create({
      admissionId,
      ...rest,
      totalFees,
      paidAmount,
      discount,
      scholarship,
      paymentStatus,
      pendingAmount,
    });

    if (admission.leadId) {
      await Lead.findByIdAndUpdate(admission.leadId, { status: "Converted" });
    }

    res.status(201).json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to create admission" });
  }
});

router.post("/convert/:leadId", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const existing = await Admission.findOne({ leadId: lead._id });
    if (existing) {
      return res.status(400).json({ message: "This lead has already been converted to admission" });
    }

    const {
      totalFees = 0,
      paidAmount = 0,
      discount = 0,
      scholarship = 0,
      admissionDate = new Date(),
      branchName = "",
      branchId = null,
      createdBy = "",
      notes = "",
      paymentMode = "",
    } = req.body;

    const { paymentStatus, pendingAmount } = computePayment(totalFees, paidAmount, discount, scholarship);
    const admissionId = await generateAdmissionId();

    const admission = await Admission.create({
      admissionId,
      leadId: lead._id,
      studentName: lead.studentName,
      email: lead.email || "",
      phone: lead.phone,
      courseName: lead.course || "",
      courseId: null,
      branchName,
      branchId,
      admissionDate,
      status: "Confirmed",
      totalFees,
      paidAmount,
      discount,
      scholarship,
      paymentStatus,
      pendingAmount,
      paymentMode,
      notes,
      createdBy,
    });

    await Lead.findByIdAndUpdate(lead._id, { status: "Converted" });

    res.status(201).json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to convert lead" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const existing = await Admission.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Admission not found" });

    const { totalFees, paidAmount, discount, scholarship, ...rest } = req.body;

    const fees = totalFees !== undefined ? totalFees : existing.totalFees;
    const paid = paidAmount !== undefined ? paidAmount : existing.paidAmount;
    const disc = discount !== undefined ? discount : existing.discount;
    const schol = scholarship !== undefined ? scholarship : existing.scholarship || 0;

    const { paymentStatus, pendingAmount } = computePayment(fees, paid, disc, schol);

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { ...rest, totalFees: fees, paidAmount: paid, discount: disc, scholarship: schol, paymentStatus, pendingAmount },
      { new: true, runValidators: true }
    );

    res.status(200).json(admission);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update admission" });
  }
});

router.patch("/:id/cancel", async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled", paymentStatus: "Refunded", paidAmount: 0, pendingAmount: 0 },
      { new: true }
    );

    if (!admission) return res.status(404).json({ message: "Admission not found" });

    res.status(200).json(admission);
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel admission", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    if (!admission) return res.status(404).json({ message: "Admission not found" });
    res.status(200).json({ message: "Admission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admission", error: error.message });
  }
});

module.exports = router;

const express = require("express");
const Institute = require("../models/Institute");
const Branch = require("../models/Branch");
const Student = require("../models/Student");
const Admission = require("../models/Admission");
const Payment = require("../models/Payment");
const InstituteCoursePurchase = require("../models/InstituteCoursePurchase");

const router = express.Router();

const getInstituteCounts = async (instituteId) => {
  const [
    totalBranches,
    totalStudents,
    totalAdmissions,
    totalCoursesPurchased,
    paymentAgg,
  ] = await Promise.all([
    Branch.countDocuments({ instituteId, status: "Active" }),
    Student.countDocuments({ instituteId, status: "Active" }),
    Admission.countDocuments({ instituteId }),
    InstituteCoursePurchase.countDocuments({ instituteId, status: "Active" }),
    Payment.aggregate([
      { $match: { instituteId: require("mongoose").Types.ObjectId.createFromHexString(instituteId), paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    totalBranches,
    totalStudents,
    totalAdmissions,
    totalCoursesPurchased,
    totalRevenue: paymentAgg.length > 0 ? paymentAgg[0].total : 0,
  };
};

router.get("/stats", async (req, res) => {
  try {
    const [totalInstitutes, totalBranches, totalStudents, totalAdmissions, totalCoursesPurchased, revenueAgg] =
      await Promise.all([
        Institute.countDocuments({ isDeleted: { $ne: true } }),
        Branch.countDocuments(),
        Student.countDocuments(),
        Admission.countDocuments(),
        InstituteCoursePurchase.countDocuments({ status: "Active" }),
        Payment.aggregate([
          { $match: { paymentStatus: "Paid" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

    res.json({
      totalInstitutes,
      totalBranches,
      totalStudents,
      totalAdmissions,
      totalCoursesPurchased,
      totalRevenue: revenueAgg.length > 0 ? revenueAgg[0].total : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { search, status, city, state, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
    const filter = { isDeleted: { $ne: true } };

    if (status) filter.status = status;
    if (city) filter.city = new RegExp(city, "i");
    if (state) filter.state = new RegExp(state, "i");

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { code: regex },
        { email: regex },
        { phone: regex },
        { instituteId: regex },
        { city: regex },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Institute.countDocuments(filter);
    const institutes = await Institute.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    const enriched = await Promise.all(
      institutes.map(async (inst) => {
        const counts = await getInstituteCounts(inst._id.toString());
        return { ...inst.toObject(), ...counts };
      })
    );

    res.json({ institutes: enriched, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const institutes = await Institute.find({ isDeleted: { $ne: true }, status: "Active" }).sort({ name: 1 });
    res.json(institutes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute || institute.isDeleted) return res.status(404).json({ message: "Institute not found" });
    const counts = await getInstituteCounts(institute._id.toString());
    res.json({ ...institute.toObject(), ...counts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name, code, email, phone, alternatePhone, address, city, state, country,
      pincode, website, registrationNumber, instituteType, establishedYear,
      logo, socialLinks, facilities, status,
    } = req.body;

    if (!name || !code || !email || !phone || !city) {
      return res.status(400).json({ message: "Name, Code, Email, Phone, and City are required" });
    }

    const institute = await Institute.create({
      name, code, email, phone, alternatePhone, address, city, state, country,
      pincode, website, registrationNumber, instituteType, establishedYear,
      logo, socialLinks, facilities, status,
    });

    res.status(201).json(institute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!institute) return res.status(404).json({ message: "Institute not found" });
    res.json(institute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id/deactivate", async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(req.params.id, { status: "Inactive" }, { new: true });
    if (!institute) return res.status(404).json({ message: "Institute not found" });
    await Branch.updateMany({ instituteId: req.params.id }, { status: "Inactive" });
    await Student.updateMany({ instituteId: req.params.id }, { status: "Inactive" });
    res.json({ message: "Institute deactivated successfully", institute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/activate", async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(req.params.id, { status: "Active" }, { new: true });
    if (!institute) return res.status(404).json({ message: "Institute not found" });
    res.json({ message: "Institute activated successfully", institute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(req.params.id, { isDeleted: true, status: "Inactive" }, { new: true });
    if (!institute) return res.status(404).json({ message: "Institute not found" });
    await Branch.updateMany({ instituteId: req.params.id }, { status: "Inactive" });
    await Student.updateMany({ instituteId: req.params.id }, { status: "Inactive" });
    res.json({ message: "Institute deleted successfully (soft delete)" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

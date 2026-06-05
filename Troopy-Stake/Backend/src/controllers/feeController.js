const Fee = require("../models/Fee");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

exports.getAll = async (req, res) => {
  try {
    const { search, status, studentId, courseId, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (studentId) filter.studentId = studentId;
    if (courseId) filter.courseId = courseId;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ installmentPlan: regex }, { notes: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Fee.countDocuments(filter);
    const fees = await Fee.find(filter)
      .populate("studentId", "name email phone")
      .populate("courseId", "name")
      .populate("counselorId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ fees, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fees", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate("studentId", "name email phone")
      .populate("courseId", "name")
      .populate("counselorId", "name email");
    if (!fee) return res.status(404).json({ message: "Fee record not found" });
    res.json({ fee });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fee", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { studentId, courseId, counselorId, totalFees, discount, scholarship, registrationFees, installmentPlan, dueDate, notes } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: "Student is required" });
    }

    const finalFees = (totalFees || 0) - (discount || 0) - (scholarship || 0);
    const fee = await Fee.create({
      studentId,
      courseId: courseId || null,
      counselorId: counselorId || null,
      totalFees: totalFees || 0,
      discount: discount || 0,
      scholarship: scholarship || 0,
      finalFees,
      registrationFees: registrationFees || 0,
      installmentPlan: installmentPlan || "",
      dueDate: dueDate || null,
      notes: notes || "",
      pendingAmount: finalFees,
    });

    res.status(201).json({ message: "Fee record created successfully", fee });
  } catch (error) {
    res.status(400).json({ message: "Failed to create fee record", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    const { totalFees, discount, scholarship, registrationFees, installmentPlan, dueDate, status, notes } = req.body;
    if (totalFees !== undefined) fee.totalFees = totalFees;
    if (discount !== undefined) fee.discount = discount;
    if (scholarship !== undefined) fee.scholarship = scholarship;
    if (registrationFees !== undefined) fee.registrationFees = registrationFees;
    if (installmentPlan !== undefined) fee.installmentPlan = installmentPlan;
    if (dueDate !== undefined) fee.dueDate = dueDate;
    if (status !== undefined) fee.status = status;
    if (notes !== undefined) fee.notes = notes;

    fee.finalFees = fee.totalFees - fee.discount - fee.scholarship;
    fee.pendingAmount = fee.finalFees - fee.paidAmount;

    await fee.save();
    res.json({ message: "Fee record updated successfully", fee });
  } catch (error) {
    res.status(400).json({ message: "Failed to update fee record", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    await Payment.deleteMany({ feeId: fee._id });
    await Invoice.deleteMany({ feeId: fee._id });
    res.json({ message: "Fee record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete fee record", error: error.message });
  }
};

exports.collectPayment = async (req, res) => {
  try {
    const { feeId } = req.params;
    const { amount, paymentMethod, transactionId, remarks, receiptUpload } = req.body;

    if (!amount || !paymentMethod) {
      return res.status(400).json({ message: "Amount and payment method are required" });
    }

    const fee = await Fee.findById(feeId).populate("studentId", "name email phone");
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    const receiptNumber = "RCP-" + Date.now();

    const payment = await Payment.create({
      feeId: fee._id,
      studentId: fee.studentId._id,
      amount,
      paymentMethod,
      transactionId: transactionId || "",
      receiptNumber,
      remarks: remarks || "",
      receiptUpload: receiptUpload || "",
      collectedBy: req.user?._id || null,
    });

    fee.paidAmount = (fee.paidAmount || 0) + amount;
    fee.pendingAmount = fee.finalFees - fee.paidAmount;
    if (fee.pendingAmount <= 0) {
      fee.status = "Paid";
    } else if (fee.paidAmount > 0) {
      fee.status = "Partial";
    }
    await fee.save();

    const invoice = await Invoice.findOne({ feeId: fee._id });
    if (invoice) {
      invoice.amount = fee.paidAmount;
      invoice.finalAmount = fee.pendingAmount > 0 ? invoice.finalAmount : 0;
      if (fee.status === "Paid") invoice.status = "Paid";
      await invoice.save();
    }

    res.status(201).json({ message: "Payment collected successfully", payment, fee });
  } catch (error) {
    res.status(400).json({ message: "Payment failed", error: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const { feeId } = req.params;
    const payments = await Payment.find({ feeId })
      .populate("collectedBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment history", error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [totalFees, totalCollected, totalPending, overdueCount] = await Promise.all([
      Fee.countDocuments(),
      Fee.aggregate([{ $group: { _id: null, total: { $sum: "$paidAmount" } } }]),
      Fee.aggregate([{ $group: { _id: null, total: { $sum: "$pendingAmount" } } }]),
      Fee.countDocuments({ status: "Overdue" }),
    ]);

    res.json({
      totalFees,
      totalCollected: totalCollected[0]?.total || 0,
      totalPending: totalPending[0]?.total || 0,
      overdueCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fee stats", error: error.message });
  }
};

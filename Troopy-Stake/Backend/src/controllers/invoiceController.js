const Invoice = require("../models/Invoice");

exports.getAll = async (req, res) => {
  try {
    const { search, status, invoiceType, startDate, endDate, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (invoiceType) filter.invoiceType = invoiceType;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ invoiceNumber: regex }, { notes: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Invoice.countDocuments(filter);
    const invoices = await Invoice.find(filter)
      .populate("studentId", "name email phone")
      .populate("counselorId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ invoices, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoices", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("studentId", "name email phone")
      .populate("feeId")
      .populate("counselorId", "name email");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ invoice });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoice", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { invoiceNumber, studentId, feeId, counselorId, amount, tax, discount, dueDate, invoiceType, notes } = req.body;
    if (!invoiceNumber || !studentId) {
      return res.status(400).json({ message: "Invoice number and student are required" });
    }

    const existing = await Invoice.findOne({ invoiceNumber });
    if (existing) {
      return res.status(400).json({ message: "Invoice number already exists" });
    }

    const finalAmount = (amount || 0) + (tax || 0) - (discount || 0);

    const invoice = await Invoice.create({
      invoiceNumber,
      studentId,
      feeId: feeId || null,
      counselorId: counselorId || null,
      amount: amount || 0,
      tax: tax || 0,
      discount: discount || 0,
      finalAmount,
      dueDate: dueDate || null,
      invoiceType: invoiceType || "Fee",
      notes: notes || "",
    });

    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    res.status(400).json({ message: "Failed to create invoice", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const { amount, tax, discount, dueDate, status, invoiceType, notes } = req.body;
    if (amount !== undefined) invoice.amount = amount;
    if (tax !== undefined) invoice.tax = tax;
    if (discount !== undefined) invoice.discount = discount;
    if (dueDate !== undefined) invoice.dueDate = dueDate;
    if (status !== undefined) invoice.status = status;
    if (invoiceType !== undefined) invoice.invoiceType = invoiceType;
    if (notes !== undefined) invoice.notes = notes;

    invoice.finalAmount = invoice.amount + invoice.tax - invoice.discount;

    await invoice.save();
    res.json({ message: "Invoice updated successfully", invoice });
  } catch (error) {
    res.status(400).json({ message: "Failed to update invoice", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete invoice", error: error.message });
  }
};

exports.generateInvoiceNumber = async (req, res) => {
  try {
    const count = await Invoice.countDocuments();
    const invNumber = `INV-${String(count + 1).padStart(5, "0")}`;
    res.json({ invoiceNumber: invNumber });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate invoice number", error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [totalInvoices, paidInvoices, pendingInvoices, overdueInvoices, totalAmount] = await Promise.all([
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: "Paid" }),
      Invoice.countDocuments({ status: "Pending" }),
      Invoice.countDocuments({ status: "Overdue" }),
      Invoice.aggregate([{ $group: { _id: null, total: { $sum: "$finalAmount" } } }]),
    ]);

    res.json({
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      totalAmount: totalAmount[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invoice stats", error: error.message });
  }
};

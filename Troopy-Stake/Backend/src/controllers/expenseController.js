const Expense = require("../models/Expense");

exports.getAll = async (req, res) => {
  try {
    const { search, status, category, startDate, endDate, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.expenseDate = {};
      if (startDate) filter.expenseDate.$gte = new Date(startDate);
      if (endDate) filter.expenseDate.$lte = new Date(endDate);
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { vendorName: regex }, { invoiceNumber: regex }, { description: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ expenses, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate("createdBy", "name email");
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ expense });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expense", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, category, amount, vendorName, invoiceNumber, expenseDate, description, attachment, status } = req.body;
    if (!title || !category || !amount) {
      return res.status(400).json({ message: "Title, category, and amount are required" });
    }

    const expense = await Expense.create({
      title,
      category,
      amount,
      vendorName: vendorName || "",
      invoiceNumber: invoiceNumber || "",
      expenseDate: expenseDate || null,
      description: description || "",
      attachment: attachment || "",
      status: status || "Pending",
      createdBy: req.user?._id || null,
    });

    res.status(201).json({ message: "Expense created successfully", expense });
  } catch (error) {
    res.status(400).json({ message: "Failed to create expense", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const { title, category, amount, vendorName, invoiceNumber, expenseDate, description, attachment, status } = req.body;
    if (title !== undefined) expense.title = title;
    if (category !== undefined) expense.category = category;
    if (amount !== undefined) expense.amount = amount;
    if (vendorName !== undefined) expense.vendorName = vendorName;
    if (invoiceNumber !== undefined) expense.invoiceNumber = invoiceNumber;
    if (expenseDate !== undefined) expense.expenseDate = expenseDate;
    if (description !== undefined) expense.description = description;
    if (attachment !== undefined) expense.attachment = attachment;
    if (status !== undefined) expense.status = status;

    await expense.save();
    res.json({ message: "Expense updated successfully", expense });
  } catch (error) {
    res.status(400).json({ message: "Failed to update expense", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete expense", error: error.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    expense.status = "Approved";
    await expense.save();
    res.json({ message: "Expense approved successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve expense", error: error.message });
  }
};

exports.reject = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    expense.status = "Rejected";
    await expense.save();
    res.json({ message: "Expense rejected successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject expense", error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [totalExpenses, approvedExpenses, pendingExpenses, totalAmount] = await Promise.all([
      Expense.countDocuments(),
      Expense.countDocuments({ status: "Approved" }),
      Expense.countDocuments({ status: "Pending" }),
      Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);

    res.json({
      totalExpenses,
      approvedExpenses,
      pendingExpenses,
      totalAmount: totalAmount[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expense stats", error: error.message });
  }
};

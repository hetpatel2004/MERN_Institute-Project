const Staff = require("../models/Staff");

exports.getAll = async (req, res) => {
  try {
    const { search, status, department, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ name: r }, { email: r }, { phone: r }, { designation: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Staff.countDocuments(filter);
    const staff = await Staff.find(filter).populate("createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ staff, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch staff", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const member = await Staff.findById(req.params.id).populate("createdBy", "name email");
    if (!member) return res.status(404).json({ message: "Staff not found" });
    res.json({ staff: member });
  } catch (error) { res.status(500).json({ message: "Failed to fetch staff", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, email, phone, department, designation, joiningDate, salary, address, status } = req.body;
    if (!name) return res.status(400).json({ message: "Staff name is required" });
    const member = await Staff.create({ name, email, phone, department, designation, joiningDate, salary, address, status, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Staff created successfully", staff: member });
  } catch (error) { res.status(400).json({ message: "Failed to create staff", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const member = await Staff.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Staff not found" });
    ["name", "email", "phone", "department", "designation", "joiningDate", "salary", "address", "status"].forEach((f) => { if (req.body[f] !== undefined) member[f] = req.body[f]; });
    await member.save();
    res.json({ message: "Staff updated successfully", staff: member });
  } catch (error) { res.status(400).json({ message: "Failed to update staff", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const member = await Staff.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete staff", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, active] = await Promise.all([Staff.countDocuments(), Staff.countDocuments({ status: "Active" })]);
    res.json({ total, active });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

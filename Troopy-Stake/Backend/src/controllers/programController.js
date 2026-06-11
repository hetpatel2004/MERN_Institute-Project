const Program = require("../models/Program");

exports.getAll = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ name: r }, { description: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Program.countDocuments(filter);
    const programs = await Program.find(filter).populate("courses", "name").populate("createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ programs, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch programs", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate("courses", "name").populate("createdBy", "name email");
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json({ program });
  } catch (error) { res.status(500).json({ message: "Failed to fetch program", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, duration, durationMonths, description, courses, totalFees, status } = req.body;
    if (!name) return res.status(400).json({ message: "Program name is required" });
    const program = await Program.create({ name, duration, durationMonths, description, courses, totalFees, status, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Program created successfully", program });
  } catch (error) { res.status(400).json({ message: error.code === 11000 ? "Program name already exists" : "Failed to create program", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    ["name", "duration", "durationMonths", "description", "courses", "totalFees", "status"].forEach((f) => { if (req.body[f] !== undefined) program[f] = req.body[f]; });
    await program.save();
    res.json({ message: "Program updated successfully", program });
  } catch (error) { res.status(400).json({ message: "Failed to update program", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json({ message: "Program deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete program", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, active] = await Promise.all([Program.countDocuments(), Program.countDocuments({ status: "Active" })]);
    res.json({ total, active });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

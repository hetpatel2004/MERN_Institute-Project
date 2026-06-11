const Faculty = require("../models/Faculty");

exports.getAll = async (req, res) => {
  try {
    const { search, status, specialization, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (specialization) filter.specialization = specialization;
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ name: r }, { email: r }, { phone: r }, { qualification: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Faculty.countDocuments(filter);
    const faculties = await Faculty.find(filter).populate("courses", "name").populate("createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ faculties, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch faculties", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id).populate("courses", "name").populate("createdBy", "name email");
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.json({ faculty });
  } catch (error) { res.status(500).json({ message: "Failed to fetch faculty", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, email, phone, specialization, qualification, experience, courses, joiningDate, status } = req.body;
    if (!name) return res.status(400).json({ message: "Faculty name is required" });
    const faculty = await Faculty.create({ name, email, phone, specialization, qualification, experience, courses, joiningDate, status, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Faculty created successfully", faculty });
  } catch (error) { res.status(400).json({ message: "Failed to create faculty", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    ["name", "email", "phone", "specialization", "qualification", "experience", "courses", "joiningDate", "status"].forEach((f) => { if (req.body[f] !== undefined) faculty[f] = req.body[f]; });
    await faculty.save();
    res.json({ message: "Faculty updated successfully", faculty });
  } catch (error) { res.status(400).json({ message: "Failed to update faculty", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.json({ message: "Faculty deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete faculty", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, active] = await Promise.all([Faculty.countDocuments(), Faculty.countDocuments({ status: "Active" })]);
    res.json({ total, active });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

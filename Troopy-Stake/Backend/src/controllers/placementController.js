const Placement = require("../models/Placement");

exports.getAll = async (req, res) => {
  try {
    const { search, status, studentId, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (studentId) filter.studentId = studentId;
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ position: r }, { companyName: r }, { remarks: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Placement.countDocuments(filter);
    const placements = await Placement.find(filter).populate("studentId", "name email phone").populate("companyId", "name").populate("createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ placements, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch placements", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id).populate("studentId", "name email phone").populate("companyId", "name").populate("createdBy", "name email");
    if (!placement) return res.status(404).json({ message: "Placement not found" });
    res.json({ placement });
  } catch (error) { res.status(500).json({ message: "Failed to fetch placement", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { studentId, companyId, companyName, position, package: pkg, offerDate, joiningDate, status, remarks } = req.body;
    if (!studentId || !position) return res.status(400).json({ message: "Student and position are required" });
    const placement = await Placement.create({ studentId, companyId, companyName, position, package: pkg, offerDate, joiningDate, status, remarks, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Placement created successfully", placement });
  } catch (error) { res.status(400).json({ message: "Failed to create placement", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) return res.status(404).json({ message: "Placement not found" });
    ["studentId", "companyId", "companyName", "position", "package", "offerDate", "joiningDate", "status", "remarks"].forEach((f) => { if (req.body[f] !== undefined) placement[f] = req.body[f]; });
    await placement.save();
    res.json({ message: "Placement updated successfully", placement });
  } catch (error) { res.status(400).json({ message: "Failed to update placement", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const placement = await Placement.findByIdAndDelete(req.params.id);
    if (!placement) return res.status(404).json({ message: "Placement not found" });
    res.json({ message: "Placement deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete placement", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, offered, accepted, joined] = await Promise.all([
      Placement.countDocuments(), Placement.countDocuments({ status: "Offered" }), Placement.countDocuments({ status: "Accepted" }), Placement.countDocuments({ status: "Joined" }),
    ]);
    res.json({ total, offered, accepted, joined });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

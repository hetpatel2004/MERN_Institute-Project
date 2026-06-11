const Attendance = require("../models/Attendance");

exports.getAll = async (req, res) => {
  try {
    const { status, userId, userModel, startDate, endDate, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    if (userModel) filter.userModel = userModel;
    if (startDate || endDate) { filter.date = {}; if (startDate) filter.date.$gte = new Date(startDate); if (endDate) filter.date.$lte = new Date(endDate); }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Attendance.countDocuments(filter);
    const records = await Attendance.find(filter).populate("markedBy", "name email").sort({ date: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ attendance: records, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch attendance", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id).populate("markedBy", "name email");
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.json({ attendance: record });
  } catch (error) { res.status(500).json({ message: "Failed to fetch attendance", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { userId, userModel, date, checkIn, checkOut, status, notes } = req.body;
    if (!userId || !userModel || !date) return res.status(400).json({ message: "User, model, and date are required" });
    const existing = await Attendance.findOne({ userId, date: new Date(date).setHours(0,0,0,0) });
    if (existing) return res.status(400).json({ message: "Attendance already marked for this date" });
    const record = await Attendance.create({ userId, userModel, date, checkIn, checkOut, status, notes, markedBy: req.user?._id || null });
    res.status(201).json({ message: "Attendance marked successfully", attendance: record });
  } catch (error) { res.status(400).json({ message: "Failed to mark attendance", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    ["checkIn", "checkOut", "status", "notes"].forEach((f) => { if (req.body[f] !== undefined) record[f] = req.body[f]; });
    await record.save();
    res.json({ message: "Attendance updated successfully", attendance: record });
  } catch (error) { res.status(400).json({ message: "Failed to update attendance", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.json({ message: "Attendance record deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete attendance", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, present, absent, late] = await Promise.all([
      Attendance.countDocuments(), Attendance.countDocuments({ status: "Present" }), Attendance.countDocuments({ status: "Absent" }), Attendance.countDocuments({ status: "Late" }),
    ]);
    res.json({ total, present, absent, late });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

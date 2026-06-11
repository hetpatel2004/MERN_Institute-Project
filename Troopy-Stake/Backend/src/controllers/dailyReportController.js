const DailyReport = require("../models/DailyReport");

exports.getAll = async (req, res) => {
  try {
    const { search, status, startDate, endDate, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (startDate || endDate) { filter.reportDate = {}; if (startDate) filter.reportDate.$gte = new Date(startDate); if (endDate) filter.reportDate.$lte = new Date(endDate); }
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ summary: r }, { notes: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await DailyReport.countDocuments(filter);
    const reports = await DailyReport.find(filter).populate("createdBy", "name email").sort({ reportDate: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ reports, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch reports", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id).populate("createdBy", "name email");
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json({ report });
  } catch (error) { res.status(500).json({ message: "Failed to fetch report", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { reportDate, summary, leadsGenerated, followUpsDone, admissionsDone, feesCollected, callsMade, meetingsHeld, notes, status } = req.body;
    if (!reportDate) return res.status(400).json({ message: "Report date is required" });
    const report = await DailyReport.create({ reportDate, summary, leadsGenerated, followUpsDone, admissionsDone, feesCollected, callsMade, meetingsHeld, notes, status, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Report created successfully", report });
  } catch (error) { res.status(400).json({ message: "Failed to create report", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const report = await DailyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    const fields = ["reportDate", "summary", "leadsGenerated", "followUpsDone", "admissionsDone", "feesCollected", "callsMade", "meetingsHeld", "notes", "status"];
    fields.forEach((f) => { if (req.body[f] !== undefined) report[f] = req.body[f]; });
    await report.save();
    res.json({ message: "Report updated successfully", report });
  } catch (error) { res.status(400).json({ message: "Failed to update report", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const report = await DailyReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete report", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, submitted, approved] = await Promise.all([
      DailyReport.countDocuments(), DailyReport.countDocuments({ status: "Submitted" }), DailyReport.countDocuments({ status: "Approved" }),
    ]);
    res.json({ total, submitted, approved });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

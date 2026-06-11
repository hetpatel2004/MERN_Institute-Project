const Broadcast = require("../models/Broadcast");

exports.getAll = async (req, res) => {
  try {
    const { search, status, channel, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (channel) filter.channel = channel;
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ title: r }, { message: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Broadcast.countDocuments(filter);
    const broadcasts = await Broadcast.find(filter).populate("createdBy", "name email").populate("templateId", "name").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ broadcasts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch broadcasts", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const broadcast = await Broadcast.findById(req.params.id).populate("createdBy", "name email").populate("templateId", "name");
    if (!broadcast) return res.status(404).json({ message: "Broadcast not found" });
    res.json({ broadcast });
  } catch (error) { res.status(500).json({ message: "Failed to fetch broadcast", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, message, channel, targetRoles, templateId, scheduledAt } = req.body;
    if (!title || !message || !channel) return res.status(400).json({ message: "Title, message, and channel are required" });
    const broadcast = await Broadcast.create({ title, message, channel, targetRoles, templateId, scheduledAt, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Broadcast created successfully", broadcast });
  } catch (error) { res.status(400).json({ message: "Failed to create broadcast", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const broadcast = await Broadcast.findById(req.params.id);
    if (!broadcast) return res.status(404).json({ message: "Broadcast not found" });
    ["title", "message", "channel", "targetRoles", "scheduledAt", "status"].forEach((f) => { if (req.body[f] !== undefined) broadcast[f] = req.body[f]; });
    if (req.body.status === "Sent") broadcast.sentAt = new Date();
    await broadcast.save();
    res.json({ message: "Broadcast updated successfully", broadcast });
  } catch (error) { res.status(400).json({ message: "Failed to update broadcast", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const broadcast = await Broadcast.findByIdAndDelete(req.params.id);
    if (!broadcast) return res.status(404).json({ message: "Broadcast not found" });
    res.json({ message: "Broadcast deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete broadcast", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, draft, scheduled, sent] = await Promise.all([
      Broadcast.countDocuments(), Broadcast.countDocuments({ status: "Draft" }), Broadcast.countDocuments({ status: "Scheduled" }), Broadcast.countDocuments({ status: "Sent" }),
    ]);
    res.json({ total, draft, scheduled, sent });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

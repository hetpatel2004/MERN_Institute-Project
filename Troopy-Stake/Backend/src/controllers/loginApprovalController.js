const LoginApproval = require("../models/LoginApproval");

exports.getAll = async (req, res) => {
  try {
    const { status, userId, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await LoginApproval.countDocuments(filter);
    const requests = await LoginApproval.find(filter).populate("userId", "name email role").populate("approvedBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ requests, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch login approvals", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const request = await LoginApproval.findById(req.params.id).populate("userId", "name email role").populate("approvedBy", "name email");
    if (!request) return res.status(404).json({ message: "Login request not found" });
    res.json({ request });
  } catch (error) { res.status(500).json({ message: "Failed to fetch login request", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { userId, loginTime, ipAddress, device, browser, location } = req.body;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const request = await LoginApproval.create({ userId, loginTime, ipAddress, device, browser, location });
    res.status(201).json({ message: "Login request created", request });
  } catch (error) { res.status(400).json({ message: "Failed to create login request", error: error.message }); }
};

exports.approve = async (req, res) => {
  try {
    const request = await LoginApproval.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Login request not found" });
    if (request.status !== "Pending") return res.status(400).json({ message: "Request already processed" });
    request.status = "Approved";
    request.approvedBy = req.user?._id || null;
    await request.save();
    res.json({ message: "Login approved", request });
  } catch (error) { res.status(500).json({ message: "Failed to approve login", error: error.message }); }
};

exports.reject = async (req, res) => {
  try {
    const request = await LoginApproval.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Login request not found" });
    if (request.status !== "Pending") return res.status(400).json({ message: "Request already processed" });
    request.status = "Rejected";
    request.approvedBy = req.user?._id || null;
    if (req.body.remarks) request.remarks = req.body.remarks;
    await request.save();
    res.json({ message: "Login rejected", request });
  } catch (error) { res.status(500).json({ message: "Failed to reject login", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const request = await LoginApproval.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: "Login request not found" });
    res.json({ message: "Login request deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete login request", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      LoginApproval.countDocuments(), LoginApproval.countDocuments({ status: "Pending" }), LoginApproval.countDocuments({ status: "Approved" }), LoginApproval.countDocuments({ status: "Rejected" }),
    ]);
    res.json({ total, pending, approved, rejected });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

const Template = require("../models/Template");

exports.getAll = async (req, res) => {
  try {
    const { search, type, category, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ name: r }, { subject: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Template.countDocuments(filter);
    const templates = await Template.find(filter).populate("createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ templates, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch templates", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).populate("createdBy", "name email");
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json({ template });
  } catch (error) { res.status(500).json({ message: "Failed to fetch template", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, type, subject, content, variables, category } = req.body;
    if (!name || !type || !content) return res.status(400).json({ message: "Name, type, and content are required" });
    const template = await Template.create({ name, type, subject, content, variables, category, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Template created successfully", template });
  } catch (error) { res.status(400).json({ message: "Failed to create template", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    ["name", "type", "subject", "content", "variables", "category"].forEach((f) => { if (req.body[f] !== undefined) template[f] = req.body[f]; });
    await template.save();
    res.json({ message: "Template updated successfully", template });
  } catch (error) { res.status(400).json({ message: "Failed to update template", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json({ message: "Template deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete template", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, email, whatsapp, sms, document] = await Promise.all([
      Template.countDocuments(), Template.countDocuments({ type: "Email" }), Template.countDocuments({ type: "WhatsApp" }), Template.countDocuments({ type: "SMS" }), Template.countDocuments({ type: "Document" }),
    ]);
    res.json({ total, email, whatsapp, sms, document });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

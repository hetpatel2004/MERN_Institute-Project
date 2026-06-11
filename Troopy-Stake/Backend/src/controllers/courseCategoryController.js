const CourseCategory = require("../models/CourseCategory");

exports.getAll = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ name: r }, { description: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await CourseCategory.countDocuments(filter);
    const categories = await CourseCategory.find(filter).sort({ name: 1 }).skip(skip).limit(parseInt(limit));
    res.json({ categories, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch categories", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const category = await CourseCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ category });
  } catch (error) { res.status(500).json({ message: "Failed to fetch category", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, slug, description, icon, color, status } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });
    const category = await CourseCategory.create({ name, slug: slug || name.toLowerCase().replace(/\s+/g, "-"), description, icon, color, status, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) { res.status(400).json({ message: error.code === 11000 ? "Category name already exists" : "Failed to create category", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const category = await CourseCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    ["name", "slug", "description", "icon", "color", "status"].forEach((f) => { if (req.body[f] !== undefined) category[f] = req.body[f]; });
    await category.save();
    res.json({ message: "Category updated successfully", category });
  } catch (error) { res.status(400).json({ message: "Failed to update category", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const category = await CourseCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete category", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, active] = await Promise.all([CourseCategory.countDocuments(), CourseCategory.countDocuments({ status: "Active" })]);
    res.json({ total, active });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

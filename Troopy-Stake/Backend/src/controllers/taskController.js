const Task = require("../models/Task");

exports.getAll = async (req, res) => {
  try {
    const { search, status, priority, assignedTo, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ title: r }, { description: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter).populate("assignedTo", "name email").populate("createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ tasks, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch tasks", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email").populate("createdBy", "name email");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ task });
  } catch (error) { res.status(500).json({ message: "Failed to fetch task", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, description, assignedTo, assignedToModel, relatedTo, relatedModel, priority, status, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const task = await Task.create({ title, description, assignedTo, assignedToModel, relatedTo, relatedModel, priority, status, dueDate, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) { res.status(400).json({ message: "Failed to create task", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const { title, description, assignedTo, priority, status, dueDate, completedAt } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) { task.status = status; if (status === "Completed") task.completedAt = new Date(); }
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (completedAt !== undefined) task.completedAt = completedAt;
    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (error) { res.status(400).json({ message: "Failed to update task", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete task", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, pending, inProgress, completed] = await Promise.all([
      Task.countDocuments(), Task.countDocuments({ status: "Pending" }), Task.countDocuments({ status: "In Progress" }), Task.countDocuments({ status: "Completed" }),
    ]);
    res.json({ total, pending, inProgress, completed });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

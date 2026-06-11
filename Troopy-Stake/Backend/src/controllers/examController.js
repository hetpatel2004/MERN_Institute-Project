const Exam = require("../models/Exam");

exports.getAll = async (req, res) => {
  try {
    const { search, status, type, courseId, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (courseId) filter.courseId = courseId;
    if (search) { const r = new RegExp(search, "i"); filter.$or = [{ title: r }]; }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Exam.countDocuments(filter);
    const exams = await Exam.find(filter).populate("courseId", "name").populate("programId", "name").populate("createdBy", "name email").sort({ examDate: -1 }).skip(skip).limit(parseInt(limit));
    res.json({ exams, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { res.status(500).json({ message: "Failed to fetch exams", error: error.message }); }
};

exports.getById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("courseId", "name").populate("programId", "name").populate("createdBy", "name email");
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json({ exam });
  } catch (error) { res.status(500).json({ message: "Failed to fetch exam", error: error.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, courseId, programId, examDate, duration, totalMarks, passingMarks, type, status } = req.body;
    if (!title) return res.status(400).json({ message: "Exam title is required" });
    const exam = await Exam.create({ title, courseId, programId, examDate, duration, totalMarks, passingMarks, type, status, createdBy: req.user?._id || null });
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) { res.status(400).json({ message: "Failed to create exam", error: error.message }); }
};

exports.update = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    ["title", "courseId", "programId", "examDate", "duration", "totalMarks", "passingMarks", "type", "status"].forEach((f) => { if (req.body[f] !== undefined) exam[f] = req.body[f]; });
    await exam.save();
    res.json({ message: "Exam updated successfully", exam });
  } catch (error) { res.status(400).json({ message: "Failed to update exam", error: error.message }); }
};

exports.remove = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) { res.status(500).json({ message: "Failed to delete exam", error: error.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const [total, upcoming, ongoing, completed] = await Promise.all([
      Exam.countDocuments(), Exam.countDocuments({ status: "Upcoming" }), Exam.countDocuments({ status: "Ongoing" }), Exam.countDocuments({ status: "Completed" }),
    ]);
    res.json({ total, upcoming, ongoing, completed });
  } catch (error) { res.status(500).json({ message: "Failed to fetch stats", error: error.message }); }
};

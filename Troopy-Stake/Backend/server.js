const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./config/tigerdb");

const authRoutes = require("./routes/authRoutes");
const instituteRoutes = require("./routes/instituteRoutes");
const companyRoutes = require("./routes/companyRoutes");
const branchRoutes = require("./routes/branchRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const branchAdminRoutes = require("./routes/branchAdminRoutes");
const leadRoutes = require("./routes/leadRoutes");
const roleUserRoutes = require("./routes/roleUserRoutes");
const roleAccessRoutes = require("./routes/roleAccessRoutes");
const topicContentRoutes = require("./routes/topicContentRoutes");
const batchRoutes = require("./routes/batchRoutes");
const followUpRoutes = require("./routes/followUpRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const instituteCoursePurchaseRoutes = require("./routes/instituteCoursePurchaseRoutes");
const counsellorRoutes = require("./routes/counsellorRoutes");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.get("/api/health", (req, res) => {
  res.json({
    server: "running",
    mongo:
    mongoose.connection.readyState === 1
    ? "connected"
    : "not connected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/branch-admin", branchAdminRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/role-access", roleUserRoutes);
app.use("/api/role-access", roleAccessRoutes);
app.use("/api/topic-content", topicContentRoutes);
app.use("/api/follow-ups", followUpRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/institute-course-purchases", instituteCoursePurchaseRoutes);
app.use("/api/counsellors", counsellorRoutes);

const PORT = process.env.PORT || 5000;

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/institute_project";

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });
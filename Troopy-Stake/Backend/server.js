const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const instituteRoutes = require("./routes/instituteRoutes");
const companyRoutes = require("./routes/companyRoutes");
const branchRoutes = require("./routes/branchRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/users", userRoutes);

// ENV fallback
const PORT = process.env.PORT || 5000;
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/institute_project";

// MongoDB connection
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });
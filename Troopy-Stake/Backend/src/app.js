const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const { validateEnv } = require("./config/env");

const env = validateEnv();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.get("/api/health", (req, res) => {
  res.json({
    server: "running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;

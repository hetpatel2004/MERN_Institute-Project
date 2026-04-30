const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/lms_project")
  .then(() => console.log("MongoDB Connected"));

app.use("/api/institute", require("./routes/instituteRoutes"));
app.use("/api/course", require("./routes/courseRoutes"));

app.listen(5000, () => console.log("Server running"));
const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema({
  name: String,
  location: String,
});

module.exports = mongoose.model("Institute", instituteSchema);
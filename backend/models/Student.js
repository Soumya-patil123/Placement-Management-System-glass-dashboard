const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  usn: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  branch: {
    type: String,
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
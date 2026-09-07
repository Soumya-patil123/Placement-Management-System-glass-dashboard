
const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

console.log("Student Routes Loaded");

// CREATE Student
router.post("/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET All Students
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Student By ID
router.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE Student
router.put("/students/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE Student
router.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student Deleted Successfully",
    });
  }catch (err) {
  console.log(err.response?.data || err.message);
  alert(err.response?.data?.message || err.message);
}
  }
);

module.exports = router;
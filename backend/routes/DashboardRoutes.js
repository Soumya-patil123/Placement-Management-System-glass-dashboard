const express = require("express");
const Student = require("../models/Student");
const Company = require("../models/Company");
const Placement = require("../models/Placement");

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const placedStudents = await Placement.countDocuments();

    const placementPercentage =
      totalStudents === 0
        ? 0
        : ((placedStudents / totalStudents) * 100).toFixed(2);

    res.json({
      totalStudents,
      totalCompanies,
      placedStudents,
      placementPercentage,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
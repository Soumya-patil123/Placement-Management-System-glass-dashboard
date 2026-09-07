const express = require("express");
const router = express.Router();

const Placement = require("../models/Placement");
const Student = require("../models/Student");
const Company = require("../models/Company");

// Add or Update Placement
router.post("/placements", async (req, res) => {
  try {
    const { student, company } = req.body;

    // Validate Student
    const studentData = await Student.findById(student);
    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Validate Company
    const companyData = await Company.findById(company);
    if (!companyData) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Check existing placement
    let placement = await Placement.findOne({ student });

    if (placement) {
      placement.company = company;
      placement.status = "Placed";
      placement.date = new Date();

      await placement.save();

      return res.json({
        success: true,
        message: "Placement Updated Successfully",
        placement,
      });
    }

    // Create new placement
    placement = await Placement.create({
      student,
      company,
      status: "Placed",
      date: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Placement Added Successfully",
      placement,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Get All Placements
router.get("/placements", async (req, res) => {
  try {
    const placements = await Placement.find()
      .populate("student")
      .populate("company");

    res.json(placements);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Delete Placement
router.delete("/placements/:id", async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Placement Deleted Successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
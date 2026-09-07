const express = require("express");
const Placement = require("../models/Placement");

const router = express.Router();

// Get All Placements
// Recent Placements
router.get("/recent", async (req, res) => {
  try {
    const placements = await Placement.find()
      .populate("student")
      .populate("company")
      .sort({ date: -1 })
      .limit(5);

    res.json(placements);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Save Placement
router.post("/", async (req, res) => {
  try {
    const { student, company } = req.body;

   const exists = await Placement.findOne({ student, company });

if (exists) {
  return res.status(400).json({
    message: "Student is already placed in this company",
  });
}

    const placement = await Placement.create({
      student,
      company,
    });

    res.json(placement);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



// Delete Placement
router.delete("/:id", async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);

    res.json({
      message: "Placement Deleted Successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});


module.exports = router;
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const placementRoutes = require("./routes/placementRoutes");
const placementResultRoutes = require("./routes/placementResultRoutes");

// Models
const Student = require("./models/Student");
const Company = require("./models/Company");
const Placement = require("./models/Placement");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Debug
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Routes
app.use("/api", studentRoutes);
app.use("/api", companyRoutes);
app.use("/api", placementRoutes);
app.use("/api/placements", placementResultRoutes);

// Dashboard API
app.get("/api/dashboard", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();

    // Count unique placed students
    const uniquePlacedStudents = await Placement.distinct("student");
    const placedStudents = uniquePlacedStudents.length;

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
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

// Placement Trend (grouped by month)
app.get("/api/dashboard/trend", async (req, res) => {
  try {
    const trend = await Placement.aggregate([
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const labels = trend.map(
      (t) => `${monthNames[t._id.month - 1]} ${t._id.year}`
    );
    const counts = trend.map((t) => t.count);

    res.json({ labels, counts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Placement Management System Running...");
});

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
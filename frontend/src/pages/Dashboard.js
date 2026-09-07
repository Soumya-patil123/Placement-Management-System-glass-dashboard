import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  TbSchool,
  TbBuildingSkyscraper,
  TbConfetti,
  TbChartLine,
} from "react-icons/tb";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [data, setData] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    placedStudents: 0,
    placementPercentage: 0,
  });

  const [trend, setTrend] = useState({ labels: [], counts: [] });
  const [recentPlacements, setRecentPlacements] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchTrend();
    fetchRecentPlacements();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTrend = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/dashboard/trend"
      );
      setTrend(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRecentPlacements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/placements");
      const sorted = [...res.data]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentPlacements(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  const unplaced = Math.max(
    0,
    data.totalStudents - data.placedStudents
  );

  const pieData = {
    labels: ["Placed", "Unplaced"],
    datasets: [
      {
        data: [
          data.placedStudents,
          unplaced,
        ],
        backgroundColor: [
          "#28a745",
          "#dc3545",
        ],
      },
    ],
  };

  const pieOptions = {
    cutout: "70%",
    plugins: { legend: { position: "bottom" } },
  };

  const barData = {
    labels: [
      "Students",
      "Companies",
      "Placed",
    ],
    datasets: [
      {
        label: "Count",
        data: [
          data.totalStudents,
          data.totalCompanies,
          data.placedStudents,
        ],
        backgroundColor: [
          "#0d6efd",
          "#ffc107",
          "#28a745",
        ],
      },
    ],
  };

  const lineData = {
    labels: trend.labels,
    datasets: [
      {
        label: "Placements",
        data: trend.counts,
        borderColor: "#ffaf7b",
        backgroundColor: "rgba(255, 175, 123, 0.25)",
        tension: 0.35,
        fill: true,
        pointBackgroundColor: "#ffaf7b",
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="dashboard-glass-bg">
      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div className="glass-title">
            <h2>Placement Dashboard</h2>
            <p className="mb-0">
              {new Date().toDateString()}
            </p>
          </div>

          <button
            className="btn glass-btn"
            onClick={() => {
              fetchDashboard();
              fetchTrend();
              fetchRecentPlacements();
            }}
          >
            Refresh
          </button>

        </div>

        <div className="card glass-card border-0 mb-4">
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h4 className="mb-1">👋 Welcome, Admin!</h4>
              <p className="mb-0">
                Here's what's happening with your placement system.
              </p>
            </div>
            <div className="text-end">
              <div>{new Date().toDateString()}</div>
            </div>
          </div>
        </div>

        <div className="row g-4">

          <div className="col-md-3">
            <div className="card glass-card border-0">
              <div className="card-body">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: 48, height: 48, background: "rgba(55,138,221,0.2)" }}
                >
                  <TbSchool size={26} color="#378ADD" />
                </div>
                <h6 className="mb-1">Total Students</h6>
                <h2 className="mb-0">{data.totalStudents}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card glass-card border-0">
              <div className="card-body">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: 48, height: 48, background: "rgba(99,153,34,0.2)" }}
                >
                  <TbBuildingSkyscraper size={26} color="#639922" />
                </div>
                <h6 className="mb-1">Total Companies</h6>
                <h2 className="mb-0">{data.totalCompanies}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card glass-card border-0">
              <div className="card-body">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: 48, height: 48, background: "rgba(127,119,221,0.2)" }}
                >
                  <TbConfetti size={26} color="#7F77DD" />
                </div>
                <h6 className="mb-1">Placed Students</h6>
                <h2 className="mb-0">{data.placedStudents}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card glass-card border-0">
              <div className="card-body">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: 48, height: 48, background: "rgba(216,90,48,0.2)" }}
                >
                  <TbChartLine size={26} color="#D85A30" />
                </div>
                <h6 className="mb-1">Placement Rate</h6>
                <h2 className="mb-0">{data.placementPercentage}%</h2>
              </div>
            </div>
          </div>

        </div>

        <div className="row mt-4 g-4">

          <div className="col-md-6">

            <div className="card glass-card border-0">

              <div className="card-body">

                <h4 className="text-center">
                  Placement Status
                </h4>

                <div style={{ position: "relative" }}>
                  <Doughnut data={pieData} options={pieOptions} />
                  <div
                    style={{
                      position: "absolute",
                      top: "44%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 500 }}>
                      {data.placementPercentage}%
                    </div>
                    <div style={{ fontSize: 12 }}>Placed</div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div className="col-md-6">

            <div className="card glass-card border-0">

              <div className="card-body">

                <h4 className="text-center">
                  Statistics
                </h4>

                <Bar data={barData} />

              </div>

            </div>

          </div>

        </div>

        <div className="card glass-card border-0 mt-4">

          <div className="card-body">

            <h4 className="text-center">
              Placement Trend
            </h4>

            {trend.labels.length === 0 ? (
              <p className="text-center mb-0">
                No placement history yet
              </p>
            ) : (
              <>
                <Line data={lineData} options={lineOptions} />
                {trend.labels.length === 1 && (
                  <p className="text-center mt-2 mb-0" style={{ fontSize: 13 }}>
                    Only one month of data so far ({trend.labels[0]}) — a
                    connecting line will appear once placements exist in a
                    second month.
                  </p>
                )}
              </>
            )}

          </div>

        </div>

        <div className="card glass-card glass-table-card border-0 mt-4">

          <div className="card-header bg-transparent border-0 fw-bold glass-title">
            Recent Placements
          </div>

          <div className="card-body">

            {recentPlacements.length === 0 ? (
              <p className="mb-0">No placements recorded yet</p>
            ) : (
              <table className="table table-borderless glass-table mb-0">

                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Student Name</th>
                    <th>Company Name</th>
                    <th>Package (LPA)</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentPlacements.map((p, i) => (
                    <tr key={p._id}>
                      <td>{i + 1}</td>
                      <td>{p.student?.name || "-"}</td>
                      <td>{p.company?.companyName || "-"}</td>
                      <td>{p.company?.package ?? "-"}</td>
                      <td>{new Date(p.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;
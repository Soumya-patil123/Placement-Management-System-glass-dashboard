import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function PlacementResults() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [placements, setPlacements] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchCompanies();
    fetchPlacements();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/companies");
      setCompanies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPlacements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/placements");
      setPlacements(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const markPlaced = async () => {
    if (!studentId || !companyId) {
      alert("Select Student and Company");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/placements", {
        student: studentId,
        company: companyId,
      });

      alert("Student Placed Successfully");

      setStudentId("");
      setCompanyId("");

      fetchPlacements();

    } catch (err) {
      console.log(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  const deletePlacement = async (id) => {
    if (!window.confirm("Delete this placement?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/placements/${id}`);

      alert("Placement Deleted Successfully");

      fetchPlacements();

    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Placement Management System", 14, 15);

    doc.setFontSize(12);
    doc.text("Placement Results Report", 14, 25);

    const tableData = placements.map((p) => [
      p.student?.name || "",
      p.company?.companyName || "",
      p.status,
    ]);

    autoTable(doc, {
      head: [["Student", "Company", "Status"]],
      body: tableData,
      startY: 35,
    });

    doc.save("Placement_Results.pdf");
  };

  const filteredPlacements = placements.filter((p) => {
    const studentName = p.student?.name || "";
    const companyName = p.company?.companyName || "";

    return (
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      companyName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="container mt-4">

      <h2 className="mb-4 text-center">
        Placement Results
      </h2>

      <div className="row mb-3">

        <div className="col-md-4">
          <select
            className="form-control"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Select Student</option>

            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-control"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            <option value="">Select Company</option>

            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <button
            className="btn btn-success w-100"
            onClick={markPlaced}
          >
            Mark Placed
          </button>
        </div>

      </div>

      <div className="mb-3">

        <button
          className="btn btn-primary"
          onClick={downloadPDF}
        >
          📄 Download PDF
        </button>

      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Student or Company"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-bordered table-striped text-center">

        <thead className="table-dark">
          <tr>
            <th>Student</th>
            <th>Company</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredPlacements.length > 0 ? (

            filteredPlacements.map((p) => (

              <tr key={p._id}>
                <td>{p.student?.name}</td>
                <td>{p.company?.companyName}</td>
                <td>{p.status}</td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deletePlacement(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>

            ))

          ) : (

            <tr>
              <td colSpan="4">
                No Placement Records Found
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default PlacementResults;
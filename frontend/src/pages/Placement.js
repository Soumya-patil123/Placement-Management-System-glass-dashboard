import { useState, useEffect } from "react";
import axios from "axios";

function Placement() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [eligibleStudents, setEligibleStudents] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/companies");
      setCompanies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch eligible students
  const checkEligibility = async (companyId) => {
    setSelectedCompany(companyId);

    if (!companyId) {
      setEligibleStudents([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/eligible/${companyId}`
      );

      console.log(res.data);

      setEligibleStudents(res.data);

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Unable to fetch eligible students"
      );
    }
  };

  // Mark student as placed
  const markPlaced = async (studentId) => {
    try {
      await axios.post("http://localhost:5000/api/placements", {
        student: studentId,
        company: selectedCompany,
        status: "Placed",
        date: new Date(),
      });

      alert("Student marked as placed successfully.");

      checkEligibility(selectedCompany);

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Unable to mark student as placed"
      );
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Placement Management
      </h2>

      <div className="card shadow p-4">

        <div className="mb-3">

          <label className="form-label">
            Select Company
          </label>

          <select
            className="form-select"
            value={selectedCompany}
            onChange={(e) => checkEligibility(e.target.value)}
          >
            <option value="">
              -- Select Company --
            </option>

            {companies.map((company) => (
              <option
                key={company._id}
                value={company._id}
              >
                {company.companyName}
              </option>
            ))}

          </select>

        </div>

      </div>

      <div className="card shadow mt-4">

        <div className="card-header bg-primary text-white">
          Eligible Students
        </div>

        <div className="card-body">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>Name</th>
                <th>USN</th>
                <th>Email</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {eligibleStudents.length > 0 ? (

                eligibleStudents.map((student) => (

                  <tr key={student._id}>

                    <td>{student.name}</td>
                    <td>{student.usn}</td>
                    <td>{student.email}</td>
                    <td>{student.branch}</td>
                    <td>{student.cgpa}</td>

                    <td>

                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => markPlaced(student._id)}
                      >
                        Mark Placed
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center"
                  >
                    No Eligible Students
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Placement;
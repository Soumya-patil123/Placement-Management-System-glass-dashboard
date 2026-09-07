import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Company() {
  const [company, setCompany] = useState({
    companyName: "",
    role: "",
    package: "",
    eligibility: "",
  });

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/companies");
      setCompanies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/companies/${editId}`,
          company
        );

        alert("Company Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/companies",
          company
        );

        alert("Company Added Successfully");
      }

      setCompany({
        companyName: "",
        role: "",
        package: "",
        eligibility: "",
      });

      setEditId(null);

      fetchCompanies();

    } catch (err) {
      console.log(err);
      alert("Operation Failed");
    }
  };

  const editCompany = (c) => {
    setCompany({
      companyName: c.companyName,
      role: c.role,
      package: c.package,
      eligibility: c.eligibility,
    });

    setEditId(c._id);
  };

  const deleteCompany = async (id) => {
    if (!window.confirm("Delete this company?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/companies/${id}`
      );

      alert("Company Deleted Successfully");

      fetchCompanies();

    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Company Management
      </h2>

      <form
        onSubmit={handleSubmit}
        className="card shadow p-4 mb-4"
      >

        <div className="row">

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              name="companyName"
              placeholder="Company Name"
              value={company.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              name="role"
              placeholder="Job Role"
              value={company.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="number"
              className="form-control"
              name="package"
              placeholder="Package (LPA)"
              value={company.package}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="number"
              className="form-control"
              name="eligibility"
              placeholder="Minimum CGPA"
              value={company.eligibility}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        <button className="btn btn-primary">
          {editId ? "Update Company" : "Add Company"}
        </button>

      </form>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search Company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive">

        <table className="table table-bordered table-striped text-center">

          <thead className="table-dark">

            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Package</th>
              <th>Minimum CGPA</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {companies
              .filter((c) =>
                c.companyName
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((c) => (

                <tr key={c._id}>

                  <td>{c.companyName}</td>
                  <td>{c.role}</td>
                  <td>{c.package} LPA</td>
                  <td>{c.eligibility}</td>

                  <td>

                    <Link
                      to={`/company/${c._id}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      View
                    </Link>

                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => editCompany(c)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteCompany(c._id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Company;
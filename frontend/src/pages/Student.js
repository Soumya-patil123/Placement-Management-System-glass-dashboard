import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Student() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    usn: "",
    email: "",
    branch: "",
    cgpa: "",
  });

  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/students/${editId}`,
          student
        );
        alert("Student Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/students",
          student
        );
        alert("Student Registered Successfully");
      }

      setStudent({
        name: "",
        usn: "",
        email: "",
        branch: "",
        cgpa: "",
      });

      setEditId(null);
      fetchStudents();

    } catch (err) {
      console.log(err);
      alert("Operation Failed");
    }
  };

  const editStudent = (s) => {
    setStudent({
      name: s.name,
      usn: s.usn,
      email: s.email,
      branch: s.branch,
      cgpa: s.cgpa,
    });

    setEditId(s._id);
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/students/${id}`
      );

      alert("Student Deleted Successfully");

      fetchStudents();

    } catch (err) {
  console.log("Full Error:", err);

  if (err.response) {
    console.log("Server Response:", err.response.data);
    alert(err.response.data.message || JSON.stringify(err.response.data));
  } else {
    alert(err.message);
  }
}
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">
        Student Management
      </h2>

      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow"
      >
        <div className="row">

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter Name"
              value={student.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              name="usn"
              placeholder="Enter USN"
              value={student.usn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter Email"
              value={student.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              name="branch"
              placeholder="Enter Branch"
              value={student.branch}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="number"
              className="form-control"
              name="cgpa"
              placeholder="Enter CGPA"
              value={student.cgpa}
              onChange={handleChange}
              required
            />
          </div>

        </div>

        <button className="btn btn-primary">
          {editId ? "Update Student" : "Register Student"}
        </button>

      </form>

      <div className="mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name, USN or Branch"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive mt-4">

        <table className="table table-bordered table-hover">

          <thead className="table-dark text-center">

            <tr>
              <th>Name</th>
              <th>USN</th>
              <th>Email</th>
              <th>Branch</th>
              <th>CGPA</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {students
              .filter((s) =>
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.usn.toLowerCase().includes(search.toLowerCase()) ||
                s.branch.toLowerCase().includes(search.toLowerCase())
              )
              .map((s) => (
                <tr key={s._id}>

                  <td>{s.name}</td>
                  <td>{s.usn}</td>
                  <td>{s.email}</td>
                  <td>{s.branch}</td>
                  <td>{s.cgpa}</td>

                  <td className="text-center">

                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => navigate(`/student/${s._id}`)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => editStudent(s)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteStudent(s._id)}
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

export default Student;
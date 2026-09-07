import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function StudentProfile() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/students/${id}`
      );

      setStudent(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!student) {
    return (
      <div className="container mt-5">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="container mt-4">

      <div className="card shadow p-4">

        <h2 className="text-center mb-4">
          Student Profile
        </h2>

        <table className="table table-bordered">

          <tbody>

            <tr>
              <th>Name</th>
              <td>{student.name}</td>
            </tr>

            <tr>
              <th>USN</th>
              <td>{student.usn}</td>
            </tr>

            <tr>
              <th>Email</th>
              <td>{student.email}</td>
            </tr>

            <tr>
              <th>Branch</th>
              <td>{student.branch}</td>
            </tr>

            <tr>
              <th>CGPA</th>
              <td>{student.cgpa}</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default StudentProfile;
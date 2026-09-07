import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function CompanyProfile() {
  const { id } = useParams();

  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/companies/${id}`
      );

      setCompany(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!company) {
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
          Company Profile
        </h2>

        <table className="table table-bordered">

          <tbody>

            <tr>
              <th>Company Name</th>
              <td>{company.companyName}</td>
            </tr>

            <tr>
              <th>Location</th>
              <td>{company.location}</td>
            </tr>

            <tr>
              <th>Package</th>
              <td>{company.package}</td>
            </tr>

            <tr>
              <th>Eligibility CGPA</th>
              <td>{company.cgpa}</td>
            </tr>

            <tr>
              <th>Description</th>
              <td>{company.description}</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default CompanyProfile;
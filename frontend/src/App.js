import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Dashboard from "./pages/Dashboard";
import Student from "./pages/Student";
import StudentProfile from "./pages/StudentProfile";
import Company from "./pages/Company";
import Placement from "./pages/Placement";
import PlacementResults from "./pages/PlacementResults";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <>
      {location.pathname !== "/login" && (
        <div className="sidebar">

          <div className="sidebar-brand">
            Placement management
          </div>

          <div className="sidebar-links">

            <NavLink className="sidebar-link" to="/">
              <span className="sidebar-icon">📊</span> Dashboard
            </NavLink>

            <NavLink className="sidebar-link" to="/students">
              <span className="sidebar-icon">👨‍🎓</span> Students
            </NavLink>

            <NavLink className="sidebar-link" to="/companies">
              <span className="sidebar-icon">🏢</span> Companies
            </NavLink>

            <NavLink className="sidebar-link" to="/placement">
              <span className="sidebar-icon">✅</span> Eligibility
            </NavLink>

            <NavLink className="sidebar-link" to="/results">
              <span className="sidebar-icon">📈</span> Results
            </NavLink>

          </div>

          <button
            className="sidebar-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      )}

      <div
        className={
          location.pathname !== "/login"
            ? "app-content-with-sidebar"
            : "container mt-4"
        }
      >

        <Routes>

          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Student />
              </ProtectedRoute>
            }
          />

          {/* Student Profile */}
          <Route
            path="/student/:id"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <Company />
              </ProtectedRoute>
            }
          />

          <Route
            path="/placement"
            element={
              <ProtectedRoute>
                <Placement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <PlacementResults />
              </ProtectedRoute>
            }
          />

        </Routes>

      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
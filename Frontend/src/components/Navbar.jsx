import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../api/auth";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container-fluid px-4">
        <a className="navbar-brand" href="/dashboard">
          <span className="brand-icon">🚀</span> Rate Limit Dashboard
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/dashboard">
                📊 Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/rules">
                ⚙️ Rules
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/logs">
                📋 Logs
              </a>
            </li>
          </ul>

          <div className="ms-auto d-flex align-items-center gap-3">
            {loading ? (
              <span className="user-info">Loading...</span>
            ) : (
              <span className="user-info">👤 {user?.full_name || "User"}</span>
            )}
            <button
              className="btn btn-danger logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

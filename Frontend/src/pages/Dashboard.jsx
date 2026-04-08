import { useEffect, useState } from "react";
import { getProfile, getRequestLogStats } from "../api/auth";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const statsData = await getRequestLogStats();
      setStats(statsData);
    } catch (err) {
      setError(
        "Failed to load dashboard: " +
          (err.response?.data?.detail || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      {/* Content */}
      <div className="container-fluid py-5">
        <div className="dashboard-header mb-5">
          <h1 className="display-4">📊 Dashboard Overview</h1>
          <p className="lead text-muted">
            Real-time API Rate Limiting Statistics
          </p>
        </div>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading dashboard data...</p>
          </div>
        ) : stats ? (
          <div>
            {/* Stats Cards Row 1 */}
            <div className="row g-4 mb-5">
              {/* Blocked Requests */}
              <div className="col-md-6 col-lg-3">
                <div className="dashboard-card card-blocked shadow-lg">
                  <div className="card-icon">🚫</div>
                  <h5 className="card-title">Blocked Requests</h5>
                  <h2 className="card-number">{stats.summary?.blocked || 0}</h2>
                  <p className="card-subtitle">Rate limit exceeded</p>
                </div>
              </div>

              {/* Allowed Requests */}
              <div className="col-md-6 col-lg-3">
                <div className="dashboard-card card-allowed shadow-lg">
                  <div className="card-icon">✅</div>
                  <h5 className="card-title">Allowed Requests</h5>
                  <h2 className="card-number">{stats.summary?.allowed || 0}</h2>
                  <p className="card-subtitle">Successful requests</p>
                </div>
              </div>

              {/* Total Processed */}
              <div className="col-md-6 col-lg-3">
                <div className="dashboard-card card-total shadow-lg">
                  <div className="card-icon">📈</div>
                  <h5 className="card-title">Total Processed</h5>
                  <h2 className="card-number">
                    {stats.summary?.total_processed || 0}
                  </h2>
                  <p className="card-subtitle">All requests</p>
                </div>
              </div>

              {/* Health Score */}
              <div className="col-md-6 col-lg-3">
                <div className="dashboard-card card-health shadow-lg">
                  <div className="card-icon">💚</div>
                  <h5 className="card-title">Health Score</h5>
                  <h2 className="card-number">{stats.health_score || "N/A"}</h2>
                  <p className="card-subtitle">System health</p>
                </div>
              </div>
            </div>

            {/* Stats Row 2 */}
            <div className="row g-4">
              {/* Top Blocked Endpoint */}
              <div className="col-md-6">
                <div className="info-card shadow">
                  <h5>🎯 Most Targeted Endpoint</h5>
                  <p className="endpoint-text">
                    {stats.top_blocked_endpoint || "N/A"}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="col-md-6">
                <div className="info-card shadow">
                  <h5>📊 Quick Summary</h5>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Block Rate:</span>
                      <span className="stat-value">
                        {stats.summary?.total_processed > 0
                          ? (
                              ((stats.summary?.blocked || 0) /
                                stats.summary?.total_processed) *
                              100
                            ).toFixed(2)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Allow Rate:</span>
                      <span className="stat-value">
                        {stats.summary?.total_processed > 0
                          ? (
                              ((stats.summary?.allowed || 0) /
                                stats.summary?.total_processed) *
                              100
                            ).toFixed(2)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="row mt-5">
              <div className="col-12">
                <div className="action-buttons">
                  <a href="/rules" className="btn btn-primary btn-lg">
                    ⚙️ Manage Rules
                  </a>
                  <a href="/logs" className="btn btn-secondary btn-lg">
                    📋 View Logs
                  </a>
                  <button
                    onClick={fetchData}
                    className="btn btn-outline-light btn-lg"
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Dashboard;

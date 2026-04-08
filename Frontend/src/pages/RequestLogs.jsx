import { useState, useEffect } from "react";
import { getRequestLogs, deleteRequestLog } from "../api/auth";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import "../styles/logs.css";

function RequestLogsPage() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const LIMIT = 10;

  useEffect(() => {
    fetchLogs();
  }, [currentPage, search, sortBy, order]);

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRequestLogs(
        LIMIT,
        currentPage,
        search,
        sortBy,
        order,
      );
      setLogs(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(
        "Failed to fetch logs: " + (err.response?.data?.detail || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      try {
        await deleteRequestLog(id);
        setSuccess("Log deleted successfully!");
        fetchLogs();
      } catch (err) {
        setError(
          "Failed to delete log: " +
            (err.response?.data?.detail || err.message),
        );
      }
    }
  };

  const getStatusBadgeClass = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return "bg-success";
    if (statusCode >= 300 && statusCode < 400) return "bg-info";
    if (statusCode >= 400 && statusCode < 500) return "bg-warning";
    return "bg-danger";
  };

  const getStatusLabel = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) return "Success ✅";
    if (statusCode >= 300 && statusCode < 400) return "Redirect 🔄";
    if (statusCode >= 400 && statusCode < 500) return "Client Error ⚠️";
    return "Server Error ❌";
  };

  return (
    <div className="logs-page">
      <Navbar />

      <div className="container-fluid py-5">
        <div className="logs-header">
          <h1>📋 Request Logs</h1>
          <p className="text-muted">Monitor all API requests and responses</p>
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

        {success && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {success}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccess("")}
            ></button>
          </div>
        )}

        {/* Search and Sort */}
        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="🔍 Search by endpoint..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select form-select-lg"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="id">Sort by ID</option>
              <option value="status_code">Sort by Status</option>
              <option value="method">Sort by Method</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select form-select-lg"
              value={order}
              onChange={(e) => {
                setOrder(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="asc">Ascending ⬆️</option>
              <option value="desc">Descending ⬇️</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="alert alert-info text-center py-5">
            <h4>No logs found 📭</h4>
            <p>No request logs available for your search.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover table-striped">
              <thead className="table-header">
                <tr>
                  <th>ID</th>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>User ID</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>#{log.id}</td>
                    <td className="endpoint-cell">{log.endpoint}</td>
                    <td>
                      <span className="badge bg-secondary">{log.method}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadgeClass(log.status_code)}`}
                      >
                        {log.status_code} {getStatusLabel(log.status_code)}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        User #{log.user_id}
                      </span>
                    </td>
                    <td className="timestamp">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(log.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

export default RequestLogsPage;

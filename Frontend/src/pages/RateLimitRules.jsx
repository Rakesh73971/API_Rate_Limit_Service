import { useState, useEffect } from "react";
import {
  getRateLimitRules,
  createRateLimitRule,
  updateRateLimitRule,
  deleteRateLimitRule,
} from "../api/auth";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import "../styles/rules.css";

function RateLimitRulesPage() {
  const [rules, setRules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    role: "",
    requests_limit: "",
    time_window: "",
  });

  const LIMIT = 10;

  useEffect(() => {
    fetchRules();
  }, [currentPage, search, sortBy, order]);

  const fetchRules = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRateLimitRules(
        LIMIT,
        currentPage,
        search,
        sortBy,
        order,
      );
      setRules(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(
        "Failed to fetch rules: " + (err.response?.data?.detail || err.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (rule = null) => {
    if (rule) {
      setEditingId(rule.id);
      setFormData({
        role: rule.role,
        requests_limit: rule.requests_limit,
        time_window: rule.time_window,
      });
    } else {
      setEditingId(null);
      setFormData({
        role: "",
        requests_limit: "",
        time_window: "",
      });
    }
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      role: "",
      requests_limit: "",
      time_window: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.role || !formData.requests_limit || !formData.time_window) {
      setError("All fields are required");
      return;
    }

    try {
      if (editingId) {
        await updateRateLimitRule(editingId, formData);
        setSuccess("Rule updated successfully!");
      } else {
        await createRateLimitRule(formData);
        setSuccess("Rule created successfully!");
      }
      handleCloseModal();
      setCurrentPage(1);
      fetchRules();
    } catch (err) {
      setError(
        "Failed to save rule: " + (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        await deleteRateLimitRule(id);
        setSuccess("Rule deleted successfully!");
        fetchRules();
      } catch (err) {
        setError(
          "Failed to delete rule: " +
            (err.response?.data?.detail || err.message),
        );
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="rules-page">
      <Navbar />

      <div className="container-fluid py-5">
        <div className="rules-header">
          <h1>⚙️ Rate Limit Rules</h1>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => handleOpenModal()}
          >
            ➕ Create New Rule
          </button>
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
              placeholder="🔍 Search by role..."
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
              <option value="role">Sort by Role</option>
              <option value="requests_limit">Sort by Limit</option>
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
            <p className="mt-3">Loading rules...</p>
          </div>
        ) : rules.length === 0 ? (
          <div className="alert alert-info text-center py-5">
            <h4>No rules found 🚫</h4>
            <p>Create your first rate limit rule to get started!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover table-striped">
              <thead className="table-header">
                <tr>
                  <th>ID</th>
                  <th>Role</th>
                  <th>Requests Limit</th>
                  <th>Time Window (minutes)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id}>
                    <td>#{rule.id}</td>
                    <td>
                      <span className="badge bg-primary">{rule.role}</span>
                    </td>
                    <td>
                      <span className="badge bg-success">
                        {rule.requests_limit}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info">{rule.time_window}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleOpenModal(rule)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(rule.id)}
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

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content modal-dark">
            <div className="modal-header border-bottom border-secondary">
              <h5 className="modal-title">
                {editingId ? "✏️ Edit Rule" : "➕ Create New Rule"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handleCloseModal}
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    name="role"
                    placeholder="e.g., admin, user"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Requests Limit</label>
                  <input
                    type="number"
                    className="form-control form-control-dark"
                    name="requests_limit"
                    placeholder="e.g., 100"
                    value={formData.requests_limit}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Time Window (minutes)</label>
                  <input
                    type="number"
                    className="form-control form-control-dark"
                    name="time_window"
                    placeholder="e.g., 60"
                    value={formData.time_window}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg">
                    {editingId ? "Update Rule" : "Create Rule"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default RateLimitRulesPage;

import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "free",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.full_name || !form.email || !form.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      await registerUser(form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-card">
          <div className="register-header">
            <div className="register-icon">📝</div>
            <h1>Create Account</h1>
            <p>Join Rate Limit Dashboard</p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                id="fullname"
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter a strong password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">User Type</label>
              <select
                id="role"
                className="form-control"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="free">🎯 Free - Limited Access</option>
                <option value="pro">⭐ Pro - Enhanced Features</option>
                <option value="admin">👑 Admin - Full Access</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-register w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{" "}
              <span className="register-link" onClick={() => navigate("/")}>
                Sign in here
              </span>
            </p>
          </div>
        </div>

        <div className="register-features">
          <div className="feature-item">
            <div className="feature-icon">🚀</div>
            <h5>Quick Setup</h5>
            <p>Start monitoring your API in minutes</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📈</div>
            <h5>Advanced Analytics</h5>
            <p>Deep insights into your API usage patterns</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚙️</div>
            <h5>Flexible Rules</h5>
            <p>Custom rate limiting rules for each role</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

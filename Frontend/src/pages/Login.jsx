import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🚀</div>
            <h1>Rate Limit Dashboard</h1>
            <p>Secure Access Portal</p>
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
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-login w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <span
                className="login-link"
                onClick={() => navigate("/register")}
              >
                Sign up here
              </span>
            </p>
          </div>
        </div>

        <div className="login-benefits">
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <h5>Real-time Monitoring</h5>
            <p>Track API requests and rate limits in real-time</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🛡️</div>
            <h5>Secure Authentication</h5>
            <p>OAuth2 protected access to your dashboard</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📊</div>
            <h5>Analytics Dashboard</h5>
            <p>Comprehensive statistics and insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

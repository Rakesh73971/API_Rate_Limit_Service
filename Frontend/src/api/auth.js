import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ============ AUTH ============
export const loginUser = async (data) => {
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);
  const res = await API.post("/login", formData);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/users/", data);
  return res.data;
};

// ============ USER ============
export const getProfile = async () => {
  const res = await API.get("/users/profile");
  return res.data;
};

export const getUser = async (id) => {
  const res = await API.get(`/users/${id}`);
  return res.data;
};

// ============ RATE LIMIT RULES ============
export const getRateLimitRules = async (limit = 10, page = 1, search = "", sort_by = "id", order = "asc") => {
  const res = await API.get("/rate_limit_rules/", {
    params: { limit, page, search, sort_by, order }
  });
  return res.data;
};

export const getRateLimitRule = async (id) => {
  const res = await API.get(`/rate_limit_rules/${id}`);
  return res.data;
};

export const createRateLimitRule = async (data) => {
  const res = await API.post("/rate_limit_rules/", data);
  return res.data;
};

export const updateRateLimitRule = async (id, data) => {
  const res = await API.put(`/rate_limit_rules/${id}`, data);
  return res.data;
};

export const deleteRateLimitRule = async (id) => {
  const res = await API.delete(`/rate_limit_rules/${id}`);
  return res.data;
};

// ============ REQUEST LOGS ============
export const getRequestLogs = async (limit = 10, page = 1, search = "", sort_by = "id", order = "asc") => {
  const res = await API.get("/request_logs/", {
    params: { limit, page, search, sort_by, order }
  });
  return res.data;
};

export const getRequestLog = async (id) => {
  const res = await API.get(`/request_logs/${id}`);
  return res.data;
};

export const createRequestLog = async (data) => {
  const res = await API.post("/request_logs/", data);
  return res.data;
};

export const updateRequestLog = async (id, data) => {
  const res = await API.put(`/request_logs/${id}`, data);
  return res.data;
};

export const deleteRequestLog = async (id) => {
  const res = await API.delete(`/request_logs/${id}`);
  return res.data;
};

export const getRequestLogStats = async () => {
  const res = await API.get("/request_logs/stats/summary");
  return res.data;
};
import { createContext, useState, useEffect, Children } from "react";
import api from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if user is already logged in one page load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api
        .get("/users/profile")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const formData = new formData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await api.post("/login", formData);
    localStorage.setItem("token", response.data.access_token);

    const profile = await api.get("/users/profile");
    setUser(profile.data);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

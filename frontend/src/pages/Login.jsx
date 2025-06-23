import { useState } from "react";
import axios from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/login", formData);
      const checkRes = await axios.get("/api/auth/check");
      if (checkRes.data.authenticated) {
        setUser(checkRes.data.user);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}
        <div className="mb-4">
          <label className="block py-2 mb-1 font-medium text-gray-500" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border-gray-300 border-2 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
            autoComplete="username"
            disabled={loading}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block py-2 mb-1 font-medium text-gray-500" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border-gray-300 border-2 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
            autoComplete="current-password"
            disabled={loading}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

import { useState } from "react";
import axios from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Magnet from "../components/advance/Magnet";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
        window.location.reload();
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
    <Magnet padding={50} disabled={false} magnetStrength={50} className="w-full">
    <div 
 
    >
      <form
        onSubmit={handleSubmit}
        className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16 w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl"
        style={{
            backdropFilter: 'blur(2px)',
            backdropShadow: '20px',
            background: 'rgba(255, 255, 255, 0.01)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
            borderRadius: '60px',
            border: '1px dashed black',
        }} 
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
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
            className="w-full border-gray-300 border-1 rounded px-3 py-2 focus:outline-none focus:ring focus:border-black text-black"
            autoComplete="username"
            disabled={loading}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block py-2 mb-1 font-medium text-gray-500" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full border-gray-300 border-1 rounded px-3 py-2 focus:outline-none focus:ring focus:border-black text-black pr-10"
              autoComplete="current-password"
              disabled={loading}
              required
            />
                          <div
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye open SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M1.5 12C3.5 6.5 8 3 12 3s8.5 3.5 10.5 9c-2 5.5-6.5 9-10.5 9S3.5 17.5 1.5 12z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                ) : (
                  // Eye closed SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M1.5 12C3.5 6.5 8 3 12 3c2.1 0 4.2.7 6 2M22.5 12c-2 5.5-6.5 9-10.5 9-2.1 0-4.2-.7-6-2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M3 3l18 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.5 14.5a3.5 3.5 0 0 1 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                )}
              </div>
          </div>
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
        <div className="mt-4 text-center text-sm text-black">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </form>
      {/* <div className="mt-4 flex flex-col items-center w-full max-w-sm">
        <span className="text-gray-500 mb-2">or</span>
        <a
          href="http://localhost:5000/api/google/auth/google"
          className="flex items-center justify-center gap-2 text-black font-semibold py-2 px-4 rounded transition w-full bg-white border border-gray-300 hover:bg-gray-100"
          style={{ maxWidth: 320 }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path fill="#4285F4" d="M43.6 20.5H42V20.5H24V27.5H35.1C33.6 31.1 30.1 33.5 24 33.5C17.4 33.5 12 28.1 12 21.5C12 14.9 17.4 9.5 24 9.5C27.1 9.5 29.7 10.6 31.7 12.4L36.6 7.5C33.3 4.5 28.9 2.5 24 2.5C12.9 2.5 4 11.4 4 21.5C4 31.6 12.9 40.5 24 40.5C34.1 40.5 44 32.5 44 21.5C44 20.3 43.9 19.4 43.6 20.5Z"/>
              <path fill="#34A853" d="M6.3 14.1L12.1 18.2C13.7 14.7 18.2 11.5 24 11.5C27.1 11.5 29.7 12.6 31.7 14.4L36.6 9.5C33.3 6.5 28.9 4.5 24 4.5C15.7 4.5 8.6 10.7 6.3 14.1Z"/>
              <path fill="#FBBC05" d="M24 44.5C30.1 44.5 35.6 41.7 39.1 37.6L33.7 33.1C31.5 35.1 28.1 36.5 24 36.5C17.4 36.5 12 31.1 12 24.5H4C4 34.6 12.9 44.5 24 44.5Z"/>
              <path fill="#EA4335" d="M43.6 20.5H42V20.5H24V27.5H35.1C34.3 29.7 32.7 31.6 30.6 33.1L36.1 37.6C39.6 34.1 44 28.6 44 21.5C44 20.3 43.9 19.4 43.6 20.5Z"/>
            </g>
          </svg>
          Continue with Google
        </a>
      </div> */}
    </div></Magnet>
  );
};

export default Login;

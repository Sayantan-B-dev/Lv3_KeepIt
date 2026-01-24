

import { useState } from "react";
import axiosInstance from "@/api/axiosInstance";
;
import { useAuth } from "@/context/AuthContext";
;
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { DottedButton } from "@/components/ui/buttons";


const Login = () => {
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
      const loginRes = await axiosInstance.post("/api/auth/login", formData, { withCredentials: true });
      if (loginRes.data && loginRes.data.user) {
        setUser(loginRes.data.user);
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        setError("1.Login failed. Please check your credentials and try again.");
        toast.error("2.Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.info(err.response.data.error);
        if (err.response.data.email) {
          navigate("/verify-email", { state: { email: err.response.data.email } });
        }
        return;
      }

      console.log("Login error object:", err);
      setError(
        err.response?.data?.message ||
        "3.Login failed. Please check your credentials and try again."
      );
      toast.error(err.response?.data?.message || "4.Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="
        w-full
        lg:w-[70%]
        p-8
        rounded-lg
        border border-muted
        glass-panel
        shadow-xl
        font-mono
      "
      >
        {/* Title */}
        <h2 className="text-2xl font-semibold text-type-1 text-center mb-6">
          Log in
        </h2>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="formInputDiv">
          <label className="block mb-1 text-sm text-type-1">
            Username or Email
          </label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username or email"
            autoComplete="username"
            disabled={loading}
            required
            className="textAreaStyle"
          />
        </div>

        {/* Password */}
        <div className="formInputDiv">
          <label className="block mb-1 text-sm text-type-1">
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              required
              className="textAreaStyle"
            />

            {/* Toggle password */}
            <div
              onClick={() => setShowPassword(v => !v)}
              className="
              absolute right-3 top-1/2 -translate-y-1/2
              cursor-pointer
              text-type-3
              hover:text-type-1
              transition
            "
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                /* eye open */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12C3.5 6.5 8 3 12 3s8.5 3.5 10.5 9c-2 5.5-6.5 9-10.5 9S3.5 17.5 1.5 12z"
                    stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3.5"
                    stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ) : (
                /* eye closed */
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M1.5 12C3.5 6.5 8 3 12 3c2.1 0 4.2.7 6 2"
                    stroke="currentColor" strokeWidth="1.5" />
                  <path d="M22.5 12c-2 5.5-6.5 9-10.5 9-2.1 0-4.2-.7-6-2"
                    stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-4 w-full">
          <Link
            to="/forgot-password"
            className="text-sm text-type-3 hover:text-type-1 underline-animation"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <div className="flex justify-center w-full ">
          <DottedButton
            text={loading ? "Logging in..." : "Log in"}
            className="w-fit text-lg"
            onClick={handleSubmit}
          />
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <div className="flex justify-center w-full ">
          <button
            type="button"
            onClick={() => window.open("http://localhost:5000/api/auth/google", "_self")}
            className="
                    flex items-center gap-3
                    px-6 py-3
                    bg-type-1 text-type-2
                    rounded-full
                    font-medium
                    hover:bg-white/20
                    hover:translate-y-[-2px]
                    active:translate-y-[2px]
                    transition
                    border border-muted
                "
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
            Continue with Google
          </button>
        </div>


        {/* Footer */}
        <div className="mt-5 text-center text-sm text-type-3">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="underline-animation text-type-1"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );

};

export default Login;

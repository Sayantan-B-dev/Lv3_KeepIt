import { useState, useRef } from "react";
import axios from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import DottedButton from "../components/buttons/DottedButton";
import Magnet from "../components/advance/Magnet";
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
    profileImagePreview: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Removed cloudinary config

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      const file = files && files[0];
      const previousImage=formData.profileImagePreview;
      console.log(previousImage);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            profileImage: file,
            profileImagePreview: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData((prev) => ({
          ...prev,
          profileImage: null,
          profileImagePreview: null,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
      profileImagePreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const res = await axios.post("api/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setUser(res.data.user || null);
      
      toast.success("Registered and logged in!");
      
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Registration failed. Please check your details and try again."
      );
      toast.error(err.response?.data?.error || "Registration failed. Please check your details and try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Magnet padding={50} disabled={false} magnetStrength={50} className="w-full">
      <div className="flex items-center justify-center bg-gray-20">
        <form
          onSubmit={handleSubmit}
          className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16 w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl"
          style={{
            backdropFilter: "blur(2px)",
            backdropShadow: "20px",
            background: "rgba(255, 255, 255, 0.01)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 32px 0 rgba(31, 38, 135, 0.10)",
            borderRadius: "60px",
            border: '1px dashed black',
          }}
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Register
          </h2>
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="mb-4">
            <label
              className="block py-2 mb-1 font-medium text-gray-500"
              htmlFor="username"
            >
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
          <div className="mb-4">
            <label
              className="block py-2 mb-1 font-medium text-gray-500"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-gray-300 border-2 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block py-2 mb-1 font-medium text-gray-500"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-gray-300 border-2 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black pr-10"
                autoComplete="new-password"
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
          <div className="mb-6">
            <label
              className="block py-2 mb-1 font-medium text-gray-500"
              htmlFor="profileImage"
            >
              Profile Image{" "}
              <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <div className="flex items-center gap-4">
              <div
                className="relative rounded-full bg-indigo-100 flex items-center justify-center text-2xl text-indigo-400 font-bold border-2 border-indigo-200 shadow"
                style={{
                  width: "56px",
                  height: "56px",
                  minWidth: "56px",
                  minHeight: "56px",
                  maxWidth: "56px",
                  maxHeight: "56px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {formData.profileImagePreview ? (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    style={{ position: "relative" }}
                    tabIndex={0}
                    aria-label="Remove profile image"
                  >
                    <img
                      src={formData.profileImagePreview}
                      alt="Profile Preview"
                      className="object-cover rounded-full"
                      style={{
                        width: "56px",
                        height: "56px",
                        minWidth: "56px",
                        minHeight: "56px",
                        maxWidth: "56px",
                        maxHeight: "56px",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full flex items-center justify-center"
                      style={{
                        width: "20px",
                        height: "20px",
                        fontSize: "14px",
                        transform: "translate(30%,-30%)",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                        cursor: loading ? "not-allowed" : "pointer",
                        border: "2px solid white",
                        zIndex: 2,
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: "block" }}
                      >
                        <path
                          d="M3 3L9 9M9 3L3 9"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>
                ) : (
                  formData.username?.[0]?.toUpperCase() || "?"
                )}
              </div>
              <label
                htmlFor="profileImage"
                className={`cursor-pointer px-4 py-2 bg-white border-2 border-blue-200 rounded-lg shadow-sm text-blue-600 font-semibold hover:bg-blue-50 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                style={{ display: "inline-block" }}
              >
                {formData.profileImagePreview ? "Change Image" : "Upload Image"}
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  disabled={loading}
                  ref={fileInputRef}
                />
              </label>
            </div>
            {/* Remove button replaced by clickable image with cross icon */}
          </div>
          <DottedButton
            text={loading ? "Registering..." : "Register"}
            type="submit"
            className={`w-full bg-blue-600 py-2 rounded font-semibold hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          />
          <div className="mt-4 text-center text-sm text-black">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline cursor-pointer text-blue-600 "
            >
              Login
            </Link>
          </div>
          <div className="mt-4 text-center text-xs text-black word-wrap" style={{ letterSpacing: "1px", fontFamily: "monospace", fontSize: "10px" }}>
            <p>
              Please save your username and password in a secure place. 
              <br />

              The "Forgot Password" feature is not available yet.
              <br />
              After registration, your session will remain active for 1 hour.
            </p>
          </div>

        </form>
      </div>
    </Magnet>
  );
};

export default Register;

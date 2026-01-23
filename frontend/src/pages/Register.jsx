import { useState, useRef } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DottedButton } from "@/components/ui/buttons";

import { handleProfileImage } from "@/utils/handleProfileImage";

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

  /* ================= INPUT HANDLER ================= */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      handleProfileImage(files?.[0], setFormData);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* ================= REMOVE IMAGE ================= */

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null,
      profileImagePreview: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= SUBMIT ================= */

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

      const res = await axiosInstance.post(
        "/api/auth/register",
        data,
        { withCredentials: true }
      );

      setUser(res.data.user);
      toast.success("Registered successfully!");
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="
          w-full lg:w-[70%]
          p-8 mb-5
          rounded-lg
          border border-muted
          glass-panel
          shadow-xl
          font-mono
        "
      >
        <h2 className="text-2xl font-semibold text-type-1 text-center mb-6">
          Register
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="formInputDiv">
          <label className="block mb-1 text-sm text-type-3">
            Username
          </label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            required
            className="textAreaStyle"
            placeholder="Choose a username"
          />
        </div>

        {/* Email */}
        <div className="formInputDiv">
          <label className="block mb-1 text-sm text-type-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
            className="textAreaStyle"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="formInputDiv">
          <label className="block mb-1 text-sm text-type-1">
            Password
          </label>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              className="textAreaStyle"
              placeholder="Create a password"
            />

            <div
              onClick={() => setShowPassword(v => !v)}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                cursor-pointer
                text-type-3
                hover:text-type-1
              "
            >
              {showPassword ? "🙈" : "👁️"}
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="mb-6 flex items-center gap-4 justify-center">
          <div className="w-14 h-14 rounded-full border border-muted overflow-hidden flex items-center justify-center">
            {formData.profileImagePreview ? (
              <img
                src={formData.profileImagePreview}
                className="w-full h-full object-cover"
              />
            ) : (
              formData.username?.[0]?.toUpperCase() || "?"
            )}
          </div>

          <label className="cursor-pointer text-sm text-type-2 underline-animation">
            {formData.profileImagePreview ? "Change image" : "Upload image"}
            <input
              type="file"
              name="profileImage"
              onChange={handleChange}
              ref={fileInputRef}
              className="hidden"
              disabled={loading}
            />
          </label>

          {formData.profileImagePreview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-xs text-red-400"
            >
              Remove
            </button>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <DottedButton
            text={loading ? "Registering..." : "Register"}
            className="text-lg"
            onClick={handleSubmit}
          />
        </div>

        {/* Footer */}
        <div className="mt-5 text-center text-sm text-type-3">
          Already have an account?{" "}
          <Link to="/login" className="underline-animation text-type-1">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

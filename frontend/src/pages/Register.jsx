import { useState, useRef } from "react";
import axiosInstance from "@/api/axiosInstance";
;
import { useAuth } from "@/context/AuthContext";
;
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DottedButton } from "@/components/ui/buttons";

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage") {
      const file = files?.[0];
      if (!file) return;

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, PNG allowed.");
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        toast.error("Image must be under 3MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: file,
          profileImagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null,
      profileImagePreview: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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

      const res = await axiosInstance.post("/api/auth/register", data, {
        withCredentials: true,
      });

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

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="
          w-full
          lg:w-[70%]
          p-8
          mb-5
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
            autoComplete="username"
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
            autoComplete="email"
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
              autoComplete="new-password"
            />

            <div
              onClick={() => setShowPassword(v => !v)}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                cursor-pointer
                text-type-3
                hover:text-type-1
                transition
              "
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1.5 12C3.5 6.5 8 3 12 3s8.5 3.5 10.5 9c-2 5.5-6.5 9-10.5 9S3.5 17.5 1.5 12z"
                    stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3.5"
                    stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ) : (
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

        {/* Profile Image */}
        <div className="mb-6 flex items-center gap-4 w-full flex justify-center">
          <div className="w-14 h-14 rounded-full border border-muted overflow-hidden flex items-center justify-center text-type-1">
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
              className="text-xs text-red-400 hover:text-red-500"
            >
              Remove
            </button>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <DottedButton
            text={loading ? "Registering..." : "Register"}
            className="w-fit text-lg"
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

        <div className="mt-4 text-center text-xs text-type-3">
          Make sure to keep your password safe. Forgot password is not available yet.
        </div>
      </form>
    </div>
  );
};

export default Register;

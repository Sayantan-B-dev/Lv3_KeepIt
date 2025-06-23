import { useState } from "react";
import axios from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((prev) => ({
        ...prev,
        profileImage: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
      console.log(data);
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const res = await axios.post("api/auth/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(res.data.user || null);
      navigate("/login");
    } catch (err){
      setError(
        err.response?.data?.error ||
        "Registration failed. Please check your details and try again."
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
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
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
        <div className="mb-4">
          <label className="block py-2 mb-1 font-medium text-gray-500" htmlFor="email">
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
          <label className="block py-2 mb-1 font-medium text-gray-500" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border-gray-300 border-2 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-black"
            autoComplete="new-password"
            disabled={loading}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block py-2 mb-1 font-medium text-gray-500" htmlFor="profileImage">
            Profile Image (optional)
          </label>
          <input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-gray-700"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

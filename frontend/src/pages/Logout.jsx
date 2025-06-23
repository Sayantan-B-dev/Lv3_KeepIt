import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call logout API
        await axiosInstance.post("/api/auth/logout");
        
        // Clear user state
        setUser(null);
        setIsAuthenticated(false);
        
        // Clear localStorage
        localStorage.removeItem("user");
        
        // Redirect to home page
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
        // Even if logout fails, clear local state and redirect
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    handleLogout();
  }, [navigate, setUser, setIsAuthenticated]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout; 
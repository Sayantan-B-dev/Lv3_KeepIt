import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    let timer;

    const handleLogout = async () => {
      try {
        await axiosInstance.post(
          "/api/auth/logout",
          {},
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        setUser(null);
        localStorage.removeItem("user");

        // keep page visible for 500ms
        timer = setTimeout(() => {
          navigate("/login", { replace: true });
        }, 500);
      }
    };

    handleLogout();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;

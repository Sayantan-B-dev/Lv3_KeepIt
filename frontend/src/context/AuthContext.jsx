import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(() => !localStorage.getItem("user"));


  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Strict timeout for auth check to handle dead backend
        const res = await axios.get("/api/auth/check", {
          withCredentials: true,
          timeout: 5000
        });
        
        if (res.data && res.data.authenticated && res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        // If server is down (ECONNREFUSED) or timeout, we keep the cached user
        // but set loading to false to unblock UI
        console.warn("Auth check failed (backend may be down):", err.message);
        // We don't nullify user on network error to allow offline viewing of cached state
        if (err.code !== 'ECONNABORTED' && err.message !== 'Network Error') {
           setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const value = {
    user,
    setUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
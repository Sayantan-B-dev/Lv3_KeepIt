import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import Note from "./pages/Note";
import axiosInstance from "./api/axiosInstance";

import { StickyNavbar } from "./components/partials/StickyNavbar";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try to get authentication status
        try {
          const authRes = await axiosInstance.get("/api/auth/check");
          if (authRes.data.authenticated) {
            setIsAuthenticated(true);
            setUser(authRes.data.user);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (authError) {
          // If auth check fails, user is not authenticated
          setIsAuthenticated(false);
          setUser(null);
        }

        // Then fetch public notes - this should work regardless of auth status
        try {
          const notesRes = await axiosInstance.get("/api/notes/public/all");
          setNotes(notesRes.data || []);
        } catch (notesError) {
          console.error("Error fetching notes:", notesError);
          setError("Failed to load notes. Please try again later.");
          setNotes([]);
        }
      } catch (e) {
        console.error("Error:", e);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <BrowserRouter>
        <StickyNavbar />

      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              notes={notes} 
              loading={loading} 
              error={error} 
              isAuthenticated={isAuthenticated}
              user={user}
            />
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/profile/:userId" 
          element={
            <Profile 
              user={user}
              loading={loading}
              error={error}
              isAuthenticated={isAuthenticated}
            />
          } 
        />
        <Route 
          path="/category/:categoryId" 
          element={
            <Category 
              user={user}
              loading={loading}
              error={error}
              isAuthenticated={isAuthenticated}
            />
          } 
        />
        <Route 
          path="/note/:noteId" 
          element={
            <Note 
              user={user}
              loading={loading}
              error={error}
              isAuthenticated={isAuthenticated}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

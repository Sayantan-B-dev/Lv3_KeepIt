import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import Note from "./pages/Note";
import Logout from "./pages/Logout";
import axiosInstance from "./api/axiosInstance";
import DotGrid from './components/advance/Background';
import Footer from "./components/partials/footer";
import MyProfile from "./pages/MyProfile";
import { StickyNavbar } from "./components/partials/StickyNavbar";
import CreateNote from "./pages/CreateNote";
import AllNotes from "./pages/AllNotes";
import AllCategories from "./pages/AllCategories";
import About from "./pages/About";
import AllUsers from "./pages/AllUsers";
import Loading from "./components/home/Loading";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try to get authentication status
        try {
          const authRes = await axiosInstance.get("/api/auth/check");
          const categoriesRes = await axiosInstance.get("/api/categories");
          setCategories(categoriesRes.data);
          if (authRes.data.authenticated) {
            setIsAuthenticated(true);
            setUser(authRes.data.user);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (authError) {
          setIsAuthenticated(false);
          setUser(null);
        }

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

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <StickyNavbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} user={user} />

      {/* background */}
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -3456, pointerEvents: 'none' }}>
        <DotGrid
          dotSize={2}
          gap={20}
          baseColor="#1a1a2e"
          activeColor="#16213e"
          proximity={100}
          shockRadius={200}
          shockStrength={3}
          resistance={600}
          returnDuration={2.0}
        />
      </div>

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
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/profile/MyProfile" element={<MyProfile user={user} loading={loading} error={error} isAuthenticated={isAuthenticated} categories={categories}/>} />
        <Route path="/CreateNote" element={<CreateNote user={user} loading={loading} error={error} isAuthenticated={isAuthenticated} categories={categories}/>} />
        <Route path="/all-categories" element={<AllCategories user={user} loading={loading} error={error} isAuthenticated={isAuthenticated} />} />
        <Route path="/all-notes" element={<AllNotes user={user} loading={loading} error={error} isAuthenticated={isAuthenticated} />} />
        <Route path="/about" element={<About user={user} loading={loading} error={error} isAuthenticated={isAuthenticated} />} />
        <Route path="/all-users" element={<AllUsers user={user} loading={loading} error={error} isAuthenticated={isAuthenticated} />} />
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
        <Route path="/CreateNote" element={<CreateNote />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;

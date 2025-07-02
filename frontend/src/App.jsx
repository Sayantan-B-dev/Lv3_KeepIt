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
import RotatingText from "./components/advance/RotatingText";
import Waiting from "./components/partials/Waiting";



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
    <>
      <BrowserRouter>
        <StickyNavbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} user={user} />

        {/* background */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            minWidth: '200vw',
            minHeight: '200vh',
            maxWidth: '200vw',
            maxHeight: '200vh',
            zIndex: -3456,
            pointerEvents: 'none',
          }}
        >
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

        {(error === "Something went wrong. Please try again later."
          || error === "Failed to load users"
          || error === "Failed to load notes. Please try again later."
          || error === "Failed to load categories. Please try again later."
          || error === "Failed to load profile. Please try again later."
          || error === "Failed to load data. Please try again later."
          || error === "Network Error"
          || error === "Request failed with status code 500"
          || error === "Request failed with status code 404"
          || error === "Request failed with status code 401"
          || error === "Request failed with status code 403"
          || error === "Internal Server Error"
          || error === "Service Unavailable"
          || error === "Backend is offline"
        ) ? (
          <Routes>
            <Route
              path="*"
              element={
                <Waiting
                  {...{
                    children: (() => {
                      if (typeof window !== "undefined") {
                        setTimeout(() => {
                          window.location.reload();
                        }, 10000);
                      }
                      return null;
                    })()
                  }}
                />
              }
            />
          </Routes>
        ) : (
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
            <Route path="/profile/MyProfile" element={<MyProfile user={user} loading={loading} error={error} isAuthenticated={isAuthenticated} categories={categories} />} />
            <Route path="/CreateNote" element={<CreateNote user={user} loading={loading} error={error} isAuthenticated={isAuthenticated} categories={categories} />} />
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
        )}

        {/* <Book />   */}
        <div className="h-[10%] flex justify-center items-center bg-transparant py-4 mb-10">
          <div className="flex items-center gap-3 px-6 py-2 bg-white/80 rounded-2xl shadow-lg border border-cyan-200">
            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-700 drop-shadow-sm tracking-tight">
              Keep
            </span>
            <RotatingText
              texts={['It', 'Notes', 'Links', 'Ideas', 'Tasks', 'Reminders', 'Snippets', 'Thoughts']}
              mainClassName="px-3 item-center sm:px-4 md:px-6 bg-gradient-to-r from-cyan-300 to-blue-200 text-cyan-900 font-bold text-xl sm:text-2xl md:text-3xl overflow-hidden py-1 sm:py-2 md:py-3 justify-center rounded-xl shadow"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </div>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;

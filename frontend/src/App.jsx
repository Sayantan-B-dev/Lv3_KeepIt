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
import Squares from "./components/advance/Squares";
import Footer from "./components/partials/footer";
import MyProfile from "./pages/MyProfile";
import { StickyNavbar } from "./components/partials/StickyNavbar";
import CreateNote from "./pages/CreateNote";
import AllNotes from "./pages/AllNotes";
import AllCategories from "./pages/AllCategories";
import About from "./pages/About";
import AllUsers from "./pages/AllUsers";
import Loading from "./components/home/Loading";
import RotatingKeepIt from "./components/RotatingKeepIt"
import Waiting from "./components/partials/Waiting";
import { useAuth } from "./context/AuthContext";
import TagNotes from "./pages/TagNotes";
import AllTags from "./pages/AllTags";


function App() {
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesRes = await axiosInstance.get("/api/categories");
        setCategories(categoriesRes.data);
        const notesRes = await axiosInstance.get("/api/notes/public/all");
        setNotes(notesRes.data || []);
      } catch (e) {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <BrowserRouter >
        <StickyNavbar />

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
          <Squares
            speed={0.5}
            squareSize={20}
            direction='down'
            borderColor='#ccc'
          />
          {/* <DotGrid
            dotSize={2}
            gap={20}
            baseColor="#1a1a2e"
            activeColor="#16213e"
            proximity={100}
            shockRadius={200}
            shockStrength={3}
            resistance={600}
            returnDuration={2.0}
          /> */}
        </div>
        {(authLoading || loading) ? <Loading /> : <div className="flex-1 flex flex-col">
          {error ? (
            <Routes>
              <Route
                path="*"
                element={
                  <Waiting
                    errorText={error}
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
                  />
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/profile/MyProfile" element={<MyProfile categories={categories} />} />
              <Route path="/CreateNote" element={<CreateNote categories={categories} />} />
              <Route path="/all-categories" element={<AllCategories />} />
              <Route path="/all-notes" element={<AllNotes />} />
              <Route path="/about" element={<About />} />
              <Route path="/all-users" element={<AllUsers />} />
              <Route path="/all-tags" element={<AllTags />} />
              <Route
                path="/profile/:userId"
                element={<Profile />}
              />
              <Route
                path="/category/:categoryId"
                element={<Category />}
              />
              <Route
                path="/note/:noteId"
                element={<Note />}
              />
              <Route
                path="/tag/:tagname"
                element={<TagNotes />}
              />
              <Route path="/CreateNote" element={<CreateNote />} />
            </Routes>
          )}
        </div>}



        <RotatingKeepIt />
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

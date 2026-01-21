import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import axiosInstance from "./api/axiosInstance";

import Footer from "./components/partials/footer";
import { SideNavbar } from "./components/partials/SideNavbar";
import Loading from "./components/home/Loading";
import Waiting from "./components/partials/Waiting";
import { useAuth } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const Category = lazy(() => import("./pages/Category"));
const Note = lazy(() => import("./pages/Note"));
const Logout = lazy(() => import("./pages/Logout"));
const CreateNote = lazy(() => import("./pages/CreateNote"));
const AllNotes = lazy(() => import("./pages/AllNotes"));
const AllCategories = lazy(() => import("./pages/AllCategories"));
const About = lazy(() => import("./pages/About"));
const AllUsers = lazy(() => import("./pages/AllUsers"));
const TagNotes = lazy(() => import("./pages/TagNotes"));
const AllTags = lazy(() => import("./pages/AllTags"));
const MyCategoryTypes = lazy(() => import("./pages/MyCategoryTypes"));
const MyCategories = lazy(() => import("./pages/MyCategories"));
const MyNotes = lazy(() => import("./pages/MyNotes"));
const MyTags = lazy(() => import("./pages/MyTags.jsx"));
const CategoryType = lazy(() => import("./pages/CategoryType"));



function App() {
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesRes = await axiosInstance.get("/api/categories");
        const notesRes = await axiosInstance.get("/api/notes/public/all");

        setCategories(categoriesRes.data);
        setNotes(notesRes.data || []);
      } catch {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar (controlled) */}
      <SideNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* MAIN CONTENT */}
      <div
        className={`
            flex-1 flex flex-col
            transition-all duration-300
            p-3
            ${sidebarOpen ? "lg:ml-[17rem]" : "lg:ml-0"}
          `}
      >
        {(authLoading || loading) ? (
          <Loading />
        ) : error ? (
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
                    })(),
                  }}
                />
              }
            />
          </Routes>
        ) : (
          <>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home notes={notes} />} />

                <Route
                  path="/login"
                  element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
                />
                <Route
                  path="/register"
                  element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
                />

                <Route
                  path="/profile/MyProfile"
                  element={
                    isAuthenticated ? (
                      <MyProfile categories={categories} />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route path="/CreateNote" element={<CreateNote categories={categories} />} />
                <Route path="/all-categories" element={<AllCategories />} />
                <Route path="/all-notes" element={<AllNotes />} />
                <Route path="/about" element={<About />} />
                <Route path="/all-users" element={<AllUsers />} />
                <Route path="/all-tags" element={<AllTags />} />

                <Route path="/my-category-types" element={<MyCategoryTypes />} />
                <Route path="/my-categories" element={<MyCategories />} />
                <Route path="/my-notes" element={<MyNotes />} />
                <Route path="/my-tags" element={<MyTags />} />
                <Route
                  path="/category-type/:id"
                  element={<CategoryType />}
                />

                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/category/:categoryId" element={<Category />} />
                <Route path="/note/:noteId" element={<Note />} />
                <Route path="/tag/:tagname" element={<TagNotes />} />
              </Routes>
            </Suspense>
          </>
        )}
            <Footer />

      </div>
    </div>
  );
}

export default App;

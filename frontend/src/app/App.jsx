import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import axiosInstance from "@/api/axiosInstance";

import { Footer, SideNavbar, Waiting } from "@/components/layout";
import { Loading } from "@/features/home";
import { useAuth } from "@/context/AuthContext";

// ─────────────────────────────────────────────
// Lazy routes
// ─────────────────────────────────────────────
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Profile = lazy(() => import("@/pages/Profile"));
const Category = lazy(() => import("@/pages/Category"));
const Note = lazy(() => import("@/pages/Note"));
const Logout = lazy(() => import("@/pages/Logout"));
const CreateNote = lazy(() => import("@/pages/CreateNote"));
const AllNotes = lazy(() => import("@/pages/AllNotes"));
const AllCategories = lazy(() => import("@/pages/AllCategories"));
const About = lazy(() => import("@/pages/About"));
const AllUsers = lazy(() => import("@/pages/AllUsers"));
const TagNotes = lazy(() => import("@/pages/TagNotes"));
const AllTags = lazy(() => import("@/pages/AllTags"));
const MyCategoryTypes = lazy(() => import("@/pages/MyCategoryTypes"));
const MyCategories = lazy(() => import("@/pages/MyCategories"));
const MyNotes = lazy(() => import("@/pages/MyNotes"));
const MyTags = lazy(() => import("@/pages/MyTags"));
const CategoryType = lazy(() => import("@/pages/CategoryType"));
const RotatingKeepIt = lazy(() => import("@/components/common/RotatingKeepIt"));

function App() {
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // public bootstrap state (kept minimal)
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [bootstrapError, setBootstrapError] = useState(null);

  // ─────────────────────────────────────────────
  // Public bootstrap (no auth dependency)
  // ─────────────────────────────────────────────
  useEffect(() => {
    let alive = true;

    const fetchPublicData = async () => {
      try {
        setBootstrapLoading(true);
        setBootstrapError(null);

        const [categoriesRes, notesRes] = await Promise.all([
          axiosInstance.get("/api/categories"),
          axiosInstance.get("/api/notes/public/all"),
        ]);

        if (!alive) return;

        setCategories(categoriesRes.data || []);
        setNotes(notesRes.data || []);
      } catch {
        if (!alive) return;
        setBootstrapError("Something went wrong. Please try again later.");
      } finally {
        if (alive) setBootstrapLoading(false);
      }
    };

    fetchPublicData();
    return () => {
      alive = false;
    };
  }, []);


  const showGlobalLoader = authLoading || bootstrapLoading;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <SideNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col
          transition-all duration-300
          p-3
          ${sidebarOpen ? "lg:ml-[17rem]" : "lg:ml-0"}
        `}
      >
        {showGlobalLoader ? (
          <Loading />
        ) : bootstrapError ? (
          <Routes>
            <Route
              path="*"
              element={
                <Waiting
                  errorText={bootstrapError}
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
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home notes={notes} />} />

              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <Login />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  !isAuthenticated ? (
                    <Register />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* Own profile */}
              <Route
                path="/profile/MyProfile"
                element={
                  isAuthenticated ? (
                    <Profile />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Public profile */}
              <Route path="/profile/:userId" element={<Profile />} />

              <Route
                path="/CreateNote"
                element={<CreateNote categories={categories} />}
              />

              <Route path="/all-categories" element={<AllCategories />} />
              <Route path="/all-notes" element={<AllNotes />} />
              <Route path="/about" element={<About />} />
              <Route path="/all-users" element={<AllUsers />} />
              <Route path="/all-tags" element={<AllTags />} />

              <Route path="/my-category-types" element={<MyCategoryTypes />} />
              <Route path="/my-categories" element={<MyCategories />} />
              <Route path="/my-notes" element={<MyNotes />} />
              <Route path="/my-tags" element={<MyTags />} />

              <Route path="/category-type/:id" element={<CategoryType />} />
              <Route path="/category/:categoryId" element={<Category />} />
              <Route path="/note/:noteId" element={<Note />} />
              <Route path="/tag/:tagname" element={<TagNotes />} />

              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Suspense>
        )}

        <RotatingKeepIt />
        <Footer />
      </div>
    </div>
  );
}

export default App;

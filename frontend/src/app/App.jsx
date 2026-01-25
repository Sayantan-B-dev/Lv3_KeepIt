import { Routes, Route, Navigate } from "react-router-dom";
import { useState, lazy, Suspense } from "react";

import { Footer, SideNavbar } from "@/components/layout";
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
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
import LiquidEther from "@/components/advanced/LiquidEther";
import ScrollToTop from "@/components/common/ScrollToTop";

function App() {
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Performance Optimization for Liquid Ether / Galaxy
  const isMobile = window.innerWidth < 768;
  const isLowEnd = isMobile || navigator.hardwareConcurrency < 4;

  const galaxyConfig = {
    density: isLowEnd ? 0.6 : 1.0,
    numLayers: isLowEnd ? 2.0 : 4.0,
    dpr: isLowEnd ? Math.min(window.devicePixelRatio, 1.25) : window.devicePixelRatio,
    glowIntensity: isLowEnd ? 0.2 : 0.3,
    twinkleIntensity: isLowEnd ? 0.2 : 0.3,
  };

  if (authLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      {/* <div className="absolute inset-0 z-0 ">
          <LiquidEther
            colors={['#dad4ee', '#dac2d9', '#ffffff']}
            mouseForce={10}
            cursorSize={40}
            isViscous
            viscous={30}
            iterationsViscous={4}
            iterationsPoisson={4}
            resolution={0.25}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={300}
            autoRampDuration={0.6}
          />
      </div> */}
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
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />

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

            <Route
              path="/forgot-password"
              element={
                !isAuthenticated ? (
                  <ForgotPassword />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/reset-password/:resetToken"
              element={
                !isAuthenticated ? (
                  <ResetPassword />
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
              element={<CreateNote />}
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

        <RotatingKeepIt />
        <Footer />
      </div>
    </div>
  );
}

export default App;

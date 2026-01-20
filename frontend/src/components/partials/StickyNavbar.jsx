import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import DottedButton from "../buttons/DottedButton";

/* ================= shared underline style ================= */

const coloredFont = {
  textDecoration: "none",
  color: "white",
  position: "relative",
  display: "inline-block",
};

const fontClass = `
  relative inline-block text-white no-underline
  after:content-[''] after:absolute after:left-0 after:bottom-0
  after:w-full after:h-[1px] after:bg-white
  after:origin-right after:scale-x-0
  after:transition-transform after:duration-300
  hover:after:origin-left hover:after:scale-x-100
`;

export { fontClass };

/* ================= sidebar styles ================= */

const sidebarBaseClass = `
  fixed top-3 left-3
  h-[calc(100vh-1.5rem)] w-64
  rounded-xl
  px-4 py-3
  z-50
  backdrop-blur-md
  border border-gray-500
  transition-transform duration-300
  flex flex-col
`;

const sidebarHiddenClass = `-translate-x-full`;

const sidebarHeaderClass = `mb-4`;

const sidebarBrandClass = `
  text-xl font-bold cursor-pointer
`;

const sidebarNavListClass = `
  flex flex-col gap-4 flex-1
`;

const sidebarNavItemClass = `
  flex items-center gap-x-3 cursor-pointer
`;

const sidebarFooterClass = `
  pt-4 mt-4
  border-t border-gray-300
  flex flex-col gap-3
`;

const sidebarProfileImgClass = `
  w-[42px] h-[42px]
  rounded-full
  border border-black
  object-cover
  cursor-pointer
  transition-transform duration-300
  hover:scale-110
`;

const sidebarHamburgerClass = `
  fixed top-4 left-4
  z-[60]
  cursor-pointer
  lg:hidden
`;

const sidebarOverlayClass = `
  fixed inset-0
  bg-black/30
  z-40
  lg:hidden
`;

/* ================= component ================= */

export function StickyNavbar() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const navItems = [
    {
      label: "All Categories",
      href: "/all-categories",
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20">
          <rect x="2" y="2" width="6" height="6" rx="2" fill="#90A4AE" />
          <rect x="12" y="2" width="6" height="6" rx="2" fill="#90A4AE" />
          <rect x="2" y="12" width="6" height="6" rx="2" fill="#90A4AE" />
          <rect x="12" y="12" width="6" height="6" rx="2" fill="#90A4AE" />
        </svg>
      ),
    },
    {
      label: "All Notes",
      href: "/all-notes",
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20">
          <rect x="3" y="4" width="14" height="2" rx="1" fill="#90A4AE" />
          <rect x="3" y="9" width="14" height="2" rx="1" fill="#90A4AE" />
          <rect x="3" y="14" width="10" height="2" rx="1" fill="#90A4AE" />
        </svg>
      ),
    },
    {
      label: "All Tags",
      href: "/all-tags",
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="#90A4AE" strokeWidth="2" />
          <rect x="7" y="9" width="6" height="2" rx="1" fill="#90A4AE" />
          <rect x="9" y="7" width="2" height="6" rx="1" fill="#90A4AE" />
        </svg>
      ),
    },
    {
      label: "All Users",
      href: "/all-users",
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20">
          <path
            d="M8 7C9.66 7 11 5.66 11 4S9.66 1 8 1 5 2.34 5 4s1.34 3 3 3Z"
            fill="#90A4AE"
          />
          <path
            d="M14 12c0-1.66-1.34-3-3-3H5c-1.66 0-3 1.34-3 3v3h12v-3Z"
            fill="#90A4AE"
          />
        </svg>
      ),
    },
    {
      label: "About",
      href: "/about",
      icon: (
        <svg width="18" height="18" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="#90A4AE" strokeWidth="2" />
          <rect x="9" y="8" width="2" height="5" rx="1" fill="#90A4AE" />
          <rect x="9" y="5" width="2" height="2" rx="1" fill="#90A4AE" />
        </svg>
      ),
    },
  ];

  /* desktop default open */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(true);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Hamburger */}
      <div className={sidebarHamburgerClass} onClick={() => setOpen(!open)}>
        <svg
          className="h-8 w-8 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </div>

      {/* Sidebar */}
      <aside className={`${sidebarBaseClass} ${open ? "translate-x-0" : sidebarHiddenClass}`}>
        {/* Brand */}
        <div className={sidebarHeaderClass}>
          <Typography
            as="div"
            className={`${sidebarBrandClass} ${fontClass}`}
            style={coloredFont}
            onClick={() => navigate("/")}
          >
            Re-Docs
          </Typography>
        </div>

        {/* Nav */}
        <nav className={sidebarNavListClass}>
          {navItems.map(({ label, href, icon }) => (
            <div
              key={label}
              className={sidebarNavItemClass}
              onClick={() => {
                navigate(href);
                if (window.innerWidth < 1024) setOpen(false);
              }}
            >
              {icon}
              <span className={fontClass} style={coloredFont}>
                {label}
              </span>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={sidebarFooterClass}>
          {isAuthenticated && (
            <div
              className="flex items-center gap-x-3 cursor-pointer"
              onClick={() => navigate("/profile/MyProfile")}
            >
              <img
                src={
                  user?.profileImage?.url ||
                  `https://ui-avatars.com/api/?name=${user?.username?.split(" ")[0] || "U"}`
                }
                className={sidebarProfileImgClass}
                alt="Profile"
              />
              <span className={fontClass} style={coloredFont}>
                {user?.username || "Profile"}
              </span>
            </div>
          )}

          {!isAuthenticated ? (
            <>
              <DottedButton text="LOG IN" onClick={() => navigate("/login")} />
              <DottedButton text="SIGN IN" onClick={() => navigate("/register")} />
            </>
          ) : (
            <DottedButton
              text="LOG OUT"
              onClick={async () => {
                try {
                  await axiosInstance.post("/api/auth/logout");
                } catch {}
                localStorage.removeItem("user");
                toast.success("Logged out successfully");
                navigate("/");
              }}
            />
          )}
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className={sidebarOverlayClass}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

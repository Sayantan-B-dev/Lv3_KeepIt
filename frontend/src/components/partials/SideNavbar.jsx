import React, { useMemo } from "react";
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

/* ================= sidebar styles ================= */

const SIDEBAR_WIDTH = "w-64";

const sidebarBaseClass = `
  fixed top-3 left-3
  h-[calc(100vh-1.5rem)] ${SIDEBAR_WIDTH}
  rounded-xl
  px-4 py-3
  z-50
  backdrop-blur-md
  border border-muted
  transition-transform duration-300 ease-in-out
  flex flex-col
`;

const sidebarHiddenClass = `-translate-x-[500px]`;

const sidebarHeaderClass = `mb-4 flex items-center justify-between`;
const sidebarBrandClass = `text-xl font-bold cursor-pointer`;
const sidebarNavListClass = `flex flex-col gap-3 flex-1
  overflow-y-auto
  pr-1`;
const sidebarNavItemClass = `flex items-center gap-x-3 cursor-pointer`;
const sidebarGroupLabelClass = `text-xs uppercase tracking-wider text-white/50 mt-2 mb-1`;
const sidebarIndentClass = `pl-4 flex flex-col gap-3`;
const sidebarDividerClass = `my-3 border-t border-muted`;

const sidebarFooterClass = `
  pt-4 mt-4
  border-t border-muted
  flex flex-col gap-3
`;

/* ================= drawer toggle (triangle) ================= */

const toggleBaseClass = `
  fixed
  left-2
  top-1/2
  -translate-y-1/2
  z-[60]
  cursor-pointer
  hover:scale-111
  transition-transform
`;

/* ================= triangle arrow icon ================= */

const SidebarToggleIcon = ({ open }) => (
  <svg
    className="h-7 w-7 text-white bg-type-b3 border border-muted backdrop-blur transition-colors hover:bg-type-b5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {open ? (
      /* ◀ collapse */
      <path d="M14.5 5l-7 7 7 7V5z" />
    ) : (
      /* ▶ expand */
      <path d="M9.5 5l7 7-7 7V5z" />
    )}
  </svg>
);

/* ================= icons ================= */

const Icons = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 20 20">
      <rect x="2" y="2" width="6" height="6" rx="2" fill="#90A4AE" />
      <rect x="12" y="2" width="6" height="6" rx="2" fill="#90A4AE" />
      <rect x="2" y="12" width="6" height="6" rx="2" fill="#90A4AE" />
      <rect x="12" y="12" width="6" height="6" rx="2" fill="#90A4AE" />
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 20 20">
      <rect x="3" y="4" width="14" height="2" rx="1" fill="#90A4AE" />
      <rect x="3" y="9" width="14" height="2" rx="1" fill="#90A4AE" />
      <rect x="3" y="14" width="10" height="2" rx="1" fill="#90A4AE" />
    </svg>
  ),
  tag: (
    <svg width="18" height="18" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="#90A4AE" strokeWidth="2" />
      <rect x="7" y="9" width="6" height="2" rx="1" fill="#90A4AE" />
      <rect x="9" y="7" width="2" height="6" rx="1" fill="#90A4AE" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 20 20">
      <path d="M8 7C9.66 7 11 5.66 11 4S9.66 1 8 1 5 2.34 5 4s1.34 3 3 3Z" fill="#90A4AE" />
      <path d="M14 12c0-1.66-1.34-3-3-3H5c-1.66 0-3 1.34-3 3v3h12v-3Z" fill="#90A4AE" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="#90A4AE" strokeWidth="2" />
      <rect x="9" y="8" width="2" height="5" rx="1" fill="#90A4AE" />
      <rect x="9" y="5" width="2" height="2" rx="1" fill="#90A4AE" />
    </svg>
  ),
};

/* ================= component ================= */

export function SideNavbar({ open, setOpen }) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const myItems = useMemo(
    () =>
      isAuthenticated
        ? [
          { label: "My Profile", href: "/about", icon: Icons.user },
          { label: "My Category Types", href: "/about", icon: Icons.tag },
          { label: "My Categories", href: "/about", icon: Icons.grid },
          { label: "My Notes", href: "/about", icon: Icons.list },
        ]
        : [],
    [isAuthenticated]
  );

  const communityItems = [
    { label: "All Users", href: "/all-users", icon: Icons.user },
    { label: "All Categories", href: "/all-categories", icon: Icons.grid },
    { label: "All Notes", href: "/all-notes", icon: Icons.list },
    { label: "All Tags", href: "/all-tags", icon: Icons.tag },
    { label: "About", href: "/about", icon: Icons.info },
  ];

  const handleNavigate = (href) => {
    navigate(href);
  };

  return (
    <div className="z-1000">
      {/* Drawer toggle */}
      <div className={toggleBaseClass} onClick={() => setOpen((v) => !v)}>
        <SidebarToggleIcon open={open} />
      </div>

      {/* Sidebar */}
      <aside
        className={`${sidebarBaseClass} ${open ? "translate-x-0" : sidebarHiddenClass
          }`}
      >
        {/* Header */}
        <div className={sidebarHeaderClass}>
          <Typography
            as="div"
            className={`${sidebarBrandClass} underline-animation`}
            style={coloredFont}
            onClick={() => handleNavigate("/")}
          >
            Re-Docs
          </Typography>
        </div>

        {/* Nav */}
        <nav className={sidebarNavListClass}>
          {isAuthenticated && (
            <>
              <div className={sidebarGroupLabelClass}>My Space</div>
              <div className={sidebarIndentClass}>
                {myItems.map(({ label, href, icon }) => (
                  <div
                    key={label}
                    className={sidebarNavItemClass}
                    onClick={() => handleNavigate(href)}
                  >
                    {icon}
                    <span className="underline-animation text-[0.8rem]" style={coloredFont}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className={sidebarDividerClass} />
            </>
          )}

          <div className={sidebarGroupLabelClass}>Community</div>
          <div className={sidebarIndentClass}>
            {communityItems.map(({ label, href, icon }) => (
              <div
                key={label}
                className={sidebarNavItemClass}
                onClick={() => handleNavigate(href)}
              >
                {icon}
                <span className="underline-animation text-[0.8rem]" style={coloredFont}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className={sidebarFooterClass}>
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
                } catch { }
                localStorage.removeItem("user");
                toast.success("Logged out successfully");
                navigate("/");
              }}
            />
          )}
        </div>
      </aside>
    </div>
  );
}

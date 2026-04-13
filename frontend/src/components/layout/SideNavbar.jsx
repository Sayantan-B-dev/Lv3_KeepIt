import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { DottedButton } from "@/components/ui/buttons";
import { motion } from "framer-motion";

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
  h-[calc(100svh-1.5rem)] ${SIDEBAR_WIDTH}
  rounded-xl
  px-4 py-3
  z-50
  backdrop-blur-md
  border border-muted
  transition-transform duration-300 ease-in-out
  flex flex-col
`;

const sidebarHiddenClass = `-translate-x-[500px]`;

const sidebarHeaderClass = `mb-3 flex items-center justify-between text-2xl font-bold cursor-pointer`;
const sidebarBrandClass = `text-xl font-bold cursor-pointer`;
const sidebarNavListClass = `flex flex-col gap-3 flex-1 overflow-y-auto pr-1`;
const sidebarNavItemClass = `flex items-center gap-x-3 cursor-pointer`;
const sidebarGroupLabelClass = `text-xs uppercase tracking-wider text-white/50 mt-2 mb-1`;
const sidebarIndentClass = `pl-4 flex flex-col gap-3`;
const sidebarDividerClass = `my-3 border-t border-muted`;

const sidebarFooterClass = `
  pt-4 mt-4
  flex flex-col gap-3
`;

/* ===== active styles ===== */

const sidebarNavItemActiveClass = `
  bg-white/10
  rounded-md
  px-2 py-1
`;

const sidebarNavTextActiveClass = `
  after:scale-x-100
  after:origin-left
`;

/* ================= drawer toggle ================= */

const toggleBaseClass = `
  fixed
  left-2
  top-1/2
  -translate-y-1/2
  z-[60]
  cursor-pointer
  hover:scale-110
  transition-transform
`;

const SidebarToggleIcon = ({ open }) => (
  <svg
    className="h-7 w-7 text-white bg-type-b3 border border-muted backdrop-blur transition-colors hover:bg-type-b5"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {open ? (
      <path d="M14.5 5l-7 7 7 7V5z" />
    ) : (
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
  const location = useLocation();
  const currentPath = location.pathname;

  const myItems = useMemo(
    () =>
      isAuthenticated
        ? [
          { label: "My Profile", href: "/profile/MyProfile", icon: Icons.user },
          { label: "My Category Types", href: "/my-category-types", icon: Icons.tag },
          { label: "My Categories", href: "/my-categories", icon: Icons.grid },
          { label: "My Notes", href: "/my-notes", icon: Icons.list },
          { label: "My Tags", href: "/my-tags", icon: Icons.tag },
        ]
        : [],
    [isAuthenticated]
  );

  const communityItems = [
    { label: "Users", href: "/all-users", icon: Icons.user },
    { label: "Categories", href: "/all-categories", icon: Icons.grid },
    { label: "Notes", href: "/all-notes", icon: Icons.list },
    { label: "Tags", href: "/all-tags", icon: Icons.tag },
    { label: "About", href: "/about", icon: Icons.info },
  ];

  const handleCreateNote = () => {
    isAuthenticated ? navigate("/CreateNote") : navigate("/login");
  };

  const renderNavItem = (item) => {
    const isActive = currentPath.startsWith(item.href);

    return (
      <div
        key={item.label}
        onClick={() => navigate(item.href)}
        className={`
          ${sidebarNavItemClass}
          ${isActive ? sidebarNavItemActiveClass : ""}
        `}
      >
        {item.icon}
        <span
          className={`
            underline-animation text-[0.8rem]
            ${isActive ? sidebarNavTextActiveClass : ""}
          `}
          style={coloredFont}
        >
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <div>
      <div className={toggleBaseClass} onClick={() => setOpen(v => !v)}>
        <SidebarToggleIcon open={open} />
      </div>

      <aside className={`${sidebarBaseClass} ${open ? "translate-x-0" : sidebarHiddenClass}`}>
        <div className={sidebarHeaderClass} onClick={() => navigate("/")}>
          Re-Docs
        </div>

        {isAuthenticated && user && (
          <div
            className="mb-3 flex flex-col items-center gap-2 cursor-pointer border border-muted p-4 rounded-lg bg-type-2 relative overflow-hidden group shadow-lg"
            onClick={() => navigate("/profile/MyProfile")}
            style={user.coverImage?.url ? {
              backgroundImage: `url(${user.coverImage.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : {}}
          >
            {/* Background Overlay */}
            {user.coverImage?.url && (
              <div className="absolute inset-0 bg-black/80 group-hover:bg-black/60 transition-colors duration-300" />
            )}

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="relative">
                {user.profileImage?.url ? (
                  <motion.img
                    src={user.profileImage.url}
                    className="w-14 h-14 rounded-full object-cover border-2 border-muted shadow-2xl"
                    whileHover={{ scale: 1.15, rotate: 2 }}
                  />
                ) : (
                  <motion.div
                    className="w-14 h-14 rounded-full bg-type-1 flex items-center justify-center text-2xl font-bold text-type-2 border-2 border-muted shadow-2xl font-mono"
                    whileHover={{ scale: 1.15, rotate: 2 }}
                  >
                    {user.username?.[0]?.toUpperCase() || "?"}
                  </motion.div>
                )}
                {(user?.isPro || user?.isPremium) && (
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-gradient-to-tr from-yellow-600 to-amber-400 text-[8px] font-black text-black rounded-md border border-yellow-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] z-10">
                    PRO
                  </div>
                )}
              </div>
              <span className="text-sm font-mono text-type-1 underline-animation font-bold drop-shadow-md">
                {user.username}
              </span>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="mb-3 w-full flex justify-center border-b border-muted pb-5">
            <DottedButton text="Create Note" className="w-full" onClick={handleCreateNote} />
          </div>
        )}

        <nav className={sidebarNavListClass}>
          {isAuthenticated && (
            <>
              <div className={sidebarGroupLabelClass}>My Space</div>
              <div className={sidebarIndentClass}>
                {myItems.map(renderNavItem)}
              </div>
              <div className={sidebarDividerClass} />
            </>
          )}

          <div className={sidebarGroupLabelClass}>Community</div>
          <div className={sidebarIndentClass}>
            {communityItems.map(renderNavItem)}
          </div>
        </nav>

        <div className={sidebarFooterClass}>
          {!isAuthenticated ? (
            <>
              <DottedButton text="LOG IN" onClick={() => navigate("/login")} />
              <DottedButton text="SIGN IN" onClick={() => navigate("/register")} />
            </>
          ) : (
            <DottedButton
              text="LOG OUT"
              onClick={() => navigate("/logout")}
            />
          )}
        </div>
      </aside>
    </div>
  );
}

import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
} from "@material-tailwind/react";
import DottedButton from "../buttons/DottedButton";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const blackFont = {
  textDecoration: "none",
  color: "black",
  position: "relative",
  display: "inline-block",
};

const blackFontClass = `
  relative inline-block text-black no-underline
  after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:bg-black
  after:origin-right after:scale-x-0 after:transition-transform after:duration-300 
  hover:after:origin-left hover:after:scale-x-100
`;
export { blackFontClass };

export function StickyNavbar({ isAuthenticated, setIsAuthenticated, user }) {
  const [openNav, setOpenNav] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const onResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const navItems = [
    {
      label: "All Categories",
      href: "/all-categories",
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
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
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
          <rect x="3" y="4" width="14" height="2" rx="1" fill="#90A4AE" />
          <rect x="3" y="9" width="14" height="2" rx="1" fill="#90A4AE" />
          <rect x="3" y="14" width="10" height="2" rx="1" fill="#90A4AE" />
        </svg>
      ),
    },
    {
      label: "All Users",
      href: "/all-users",
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
          <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" fill="#90A4AE" />
          <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="#90A4AE" />
        </svg>
      ),
    },
    {
      label: "About",
      href: "/about",
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="#90A4AE" strokeWidth="2" />
          <rect x="9" y="8" width="2" height="5" rx="1" fill="#90A4AE" />
          <rect x="9" y="5" width="2" height="2" rx="1" fill="#90A4AE" />
        </svg>
      ),
    },
  ];

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 md:gap-3 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {navItems.map(({ label, href, icon }) => (
        <li
          key={label}
          className="flex items-center gap-x-2 p-1 font-medium"
        >
          {icon}
          <a
            href={href}
            className={`flex items-center text-base md:text-[1.05rem] ${blackFontClass}`}
            style={blackFont}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <Navbar
      className={`w-[90%] max-w-full md:max-w-[96%] lg:max-w-[90%] mx-auto rounded-2xl md:rounded-3xl lg:rounded-4xl py-2 px-2 sm:px-4 md:px-6 lg:px-8 lg:py-4 sticky top-2 md:top-4 z-50 transition-colors backdrop-blur-xs duration-500 ${scrolled
        ? "bg-white/20 backdrop-blur-xs border border-gray-500 shadow-3xl"
        : "bg-black/5"
        }`}
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between text-blue-gray-900 gap-y-2">
        <Typography
          as="a"
          href="#"
          className="mr-2 sm:mr-4 cursor-pointer py-1.5 font-bold text-xl sm:text-2xl"
          style={{ textDecoration: "none", color: "black" }}
          onClick={() => navigate("/")}
        >
          KeepIt
        </Typography>
        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 justify-center">{navList}</div>
        {/* Desktop Auth Buttons/Profile */}

        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-3">
            {isAuthenticated && (
              <div
                className="cursor-pointer hover:scale-110 transition-all duration-300 active:scale-95"
                onClick={() => {
                  setOpenNav(false);
                  navigate("/profile/MyProfile");
                }}
                style={{ outline: "none" }}
              >
                <img
                  src={
                    user?.profileImage?.url ||
                    `https://ui-avatars.com/api/?name=${user?.username?.split(" ")[0] || "U"}&background=E0E7FF&color=6366F1`
                  }
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-black"
                  alt="Profile"
                />
              </div>
            )}
            {/* Mobile Hamburger */}
            <div
              onClick={() => setOpenNav(!openNav)}
              className="cursor-pointer flex items-center lg:hidden ml-auto"
              aria-label={openNav ? "Close navigation menu" : "Open navigation menu"}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 sm:h-8 sm:w-8 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-x-3">
            {!isAuthenticated && (
              <>
                <DottedButton text="Log In" onClick={() => navigate("/login")} />
                <DottedButton text="Sign in" onClick={() => navigate("/register")} />
              </>
            )}
            {isAuthenticated && (
              <>
                <DottedButton
                  text="Log Out"
                  className="hidden lg:block"
                  onClick={async () => {
                    try {
                      await axiosInstance.post("/api/auth/logout");
                    } catch (err) {

                    }
                    localStorage.removeItem("user");
                    setIsAuthenticated(false);
                    toast.success("Logged out successfully");
                    setTimeout(() => {
                      navigate("/");
                    }, 3000);
                  }}
                />
              </>
            )}
          </div>
        </div>

      </div>
      {/* Mobile Nav */}
      <Collapse open={openNav}>
        <div className="container mx-auto flex flex-col gap-4 py-2">
          <div className="w-full">{navList}</div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-x-3">
            {!isAuthenticated && (
              <>
                <DottedButton
                  text="Log In"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setOpenNav(false);
                    navigate("/login");
                  }}
                />
                <DottedButton
                  text="Sign in"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setOpenNav(false);
                    navigate("/register");
                  }}
                />
              </>
            )}
            {isAuthenticated && (
              <>
                <DottedButton
                  text="Log Out"
                  className="w-full sm:w-auto"
                  onClick={async () => {
                    try {
                      await axiosInstance.post("/api/auth/logout");
                    } catch (err) {
                    }
                    localStorage.removeItem("user");
                    setIsAuthenticated(false);
                    setOpenNav(false);
                    toast.success("Logged out successfully");
                    setTimeout(() => {
                      navigate("/");
                    }, 3000);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </Collapse>
    </Navbar>
  );
}
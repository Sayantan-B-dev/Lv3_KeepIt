import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
} from "@material-tailwind/react";
import DottedButton from "../buttons/DottedButton";
import { useNavigate } from "react-router-dom";


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

    // Clean up both listeners on unmount
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const navItems = [
    {
      label: "All Categories",
      href: "/categories",
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
          <rect x="2" y="2" width="6" height="6" rx="2" fill="#90A4AE"/>
          <rect x="12" y="2" width="6" height="6" rx="2" fill="#90A4AE"/>
          <rect x="2" y="12" width="6" height="6" rx="2" fill="#90A4AE"/>
          <rect x="12" y="12" width="6" height="6" rx="2" fill="#90A4AE"/>
        </svg>
      ),
    },
    {
      label: "All Notes",
      href: "/notes",
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
          <rect x="3" y="4" width="14" height="2" rx="1" fill="#90A4AE"/>
          <rect x="3" y="9" width="14" height="2" rx="1" fill="#90A4AE"/>
          <rect x="3" y="14" width="10" height="2" rx="1" fill="#90A4AE"/>
        </svg>
      ),
    },
    {
      label: "About",
      href: "/about",
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="#90A4AE" strokeWidth="2"/>
          <rect x="9" y="8" width="2" height="5" rx="1" fill="#90A4AE"/>
          <rect x="9" y="5" width="2" height="2" rx="1" fill="#90A4AE"/>
        </svg>
      ),
    },
  ];

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {navItems.map(({ label, href, icon }) => (
        <li key={label} className="flex items-center gap-x-2 p-1 font-medium">
          {icon}
          <a href={href} className={`flex items-center ${blackFontClass}`} style={blackFont}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  );


  return (
    <Navbar className={`mx-auto max-w-[90%] rounded-4xl py-2 px-4 lg:px-8 lg:py-4 sticky top-4 z-50 transition-colors backdrop-blur-xs duration-500 ${scrolled ? "bg-white/20 backdrop-blur-xs border border-gray-500 shadow-3xl" : "bg-black/5"}`}>
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-bold text-2xl"
          style={{ textDecoration: "none", color: "black" }}
          onClick={() => navigate("/")}
        >
          KeepIt
        </Typography>
        <div className="hidden lg:block">{navList}</div>
        {!isAuthenticated && <div className="flex items-center gap-x-3">
          <DottedButton text="Log In" onClick={() => navigate("/login")} />
          <DottedButton text="Sign in" onClick={() => navigate("/register")} />
        </div>}
        {isAuthenticated && <div className="flex items-center gap-x-3">
          <DottedButton text="Log Out" className="hidden lg:block" onClick={() => {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            navigate("/");
          }} />
          <div
            className="cursor-pointer hover:scale-110 transition-all duration-300 active:scale-95"
            onClick={() => navigate("/profile/MyProfile")}
            style={{ outline: "none" }}
          >
            <img
              src={user?.profileImage?.url || `https://ui-avatars.com/api/?name=${user?.username.split(" ")[0]}&background=E0E7FF&color=6366F1`}
              className="w-12 h-12 rounded-full object-cover border border-black"
            />
          </div>
        </div>}

        <div
          onClick={() => setOpenNav(!openNav)}
          className="cursor-pointer lg:hidden"
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 cursor-pointer text-black"
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
              className="h-6 w-6 cursor-pointer text-black"
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
      <Collapse open={openNav}>
        <div className="container mx-auto">
          {navList}
          {!isAuthenticated && <div className="flex items-center gap-x-3">
            <DottedButton text="Log In" onClick={() => navigate("/login")} />
            <DottedButton text="Sign in" onClick={() => navigate("/register")} />
          </div>}
          {isAuthenticated && <div className="flex items-center gap-x-3">
            <DottedButton
              text="Log Out"
              onClick={() => {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                navigate("/");
              }}
            />
          </div>}
        </div>
      </Collapse>
    </Navbar>
  );
}
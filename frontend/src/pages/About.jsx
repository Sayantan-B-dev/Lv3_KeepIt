import React from "react";
import { useNavigate } from "react-router-dom";
import Magnet from "../components/advance/Magnet";

const clickableOptions = [
  {
    label: "Explore All Notes",
    description: "Browse notes shared by the community.",
    route: "/all-notes",
    color: "bg-indigo-600 hover:bg-indigo-700",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    label: "Browse Categories",
    description: "Discover and organize by topics.",
    route: "/all-categories",
    color: "bg-green-600 hover:bg-green-700",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    label: "Create a Note",
    description: "Start writing your own note.",
    route: "/CreateNote",
    color: "bg-yellow-500 hover:bg-yellow-600",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    label: "Meet the Community",
    description: "Connect with authors and explore profiles.",
    route: "/all-users",
    color: "bg-pink-500 hover:bg-pink-600",
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" />
      </svg>
    ),
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <Magnet padding={50} disabled={false} magnetStrength={100} className="w-full">
      <div
        className="container mx-auto p-6 max-w-3xl shadow-2xl border-1 border-dashed border-black mt-10 mb-22 relative"
        style={{
          backdropFilter: 'blur(2px)',
          backdropShadow: '20px',
          background: 'rgba(255, 255, 255, 0.01)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
          borderRadius: '60px',
        }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-800 mb-8 tracking-tight drop-shadow-lg">About KeepIt</h2>
        <div className="text-lg text-gray-700 leading-relaxed mb-8">
          <p>
            <span className="font-semibold text-indigo-700 cursor-pointer" onClick={() => navigate("/")}>KeepIt</span> is a collaborative note-taking platform designed to help you organize, share, and discover knowledge with ease. Whether you're a student, professional, or lifelong learner, NoteMagnet empowers you to create, categorize, and explore notes from a vibrant community.
          </p>
        </div>
        <div className="mb-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clickableOptions.map((option, idx) => (
              <li key={option.label}>
                <button
                  onClick={() => navigate(option.route)}
                  className={`flex items-center w-full px-5 py-4 rounded-2xl shadow-md transition-all duration-200 text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 ${option.color}`}
                  style={{ minHeight: "64px" }}
                >
                  {option.icon}
                  <div className="flex flex-col items-start">
                    <span>{option.label}</span>
                    <span className="text-xs text-white/80 font-normal">{option.description}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center text-sm text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-indigo-700">KeepIt</span>. Built with <span role="img" aria-label="love">❤️</span> by the Sayantan.
        </div>
      </div>  
    </Magnet>
  );
};

export default About;

import React from "react";
import { useNavigate } from "react-router-dom";
import DottedButton from "../components/buttons/DottedButton";


const containerClass = `
  w-full max-w-none
    mx-0
  mb-5 p-6
  relative
  border border-muted
  rounded-xl
  shadow-2xl
  glass-panel
`;

const headingClass = `
  text-3xl font-extrabold text-center
  mb-8 tracking-tight drop-shadow-lg text-type-1
`;

const paragraphClass = `
  text-lg leading-relaxed mb-8 text-type-3
`;

const brandClass = `
  font-semibold text-type-2 cursor-pointer
`;

const clickableOptions = [
  {
    label: "Explore All Notes",
    route: "/all-notes",
  },
  {
    label: "Browse Categories",
    route: "/all-categories",
  },
  {
    label: "Create a Note",
    route: "/CreateNote",
  },
  {
    label: "Meet the Community",
    route: "/all-users",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <>
<div className={containerClass}>
  <h2 className={headingClass}>
    About{" "}
    <span className="underline cursor-pointer" onClick={() => navigate("/")}>
      Re-Docs
    </span>
  </h2>

  {/* Intro */}
  <div className={paragraphClass}>
    <p>
      <span className={brandClass} onClick={() => navigate("/")}>
        Re-Docs
      </span>{" "}
      is a focused knowledge-organization platform built for long-form thinking.
      It helps you write, organize, and revisit ideas in a clean, distraction-free
      environment. The goal is to keep your notes simple on the surface while
      remaining powerful underneath.
    </p>
  </div>



  {/* Actions */}
  <div className="mb-8">
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {clickableOptions.map(({ label, route }) => (
        <li key={label}>
          <DottedButton
            text={label}
            onClick={() => navigate(route)}
            style={{ width: "100%" }}
          />
        </li>
      ))}
    </ul>
  </div>

  {/* Footer */}
  <div className="text-center text-sm text-type-3 mt-8">
    © {new Date().getFullYear()}{" "}
    <span className={brandClass} onClick={() => navigate("/")}>
      Re-Docs
    </span>
    . Built with care and intention by Sayantan.
  </div>
</div>

    </>
  );
};

export default About;

import React from "react";
import DottedButton from "../buttons/DottedButton";
import { useNavigate } from "react-router-dom";

const boxes = [
  {
    title: "Create Notes",
    description: "Write and store your thoughts in one place",
    icon: "📝",
  },
  {
    title: "Organize Content",
    description: "Group notes by tags and categories",
    icon: "🗂️",
  },
  {
    title: "Discover Notes",
    description: "Explore notes shared by other users",
    icon: "🔍",
  }
];

const Hero = ({ user, loading, error, isAuthenticated }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        border border-muted
        relative overflow-hidden
        mb-10 rounded-xl flex items-center
        p-4 sm:p-6 md:p-10
        bg-cover bg-center bg-no-repeat
        min-h-[500px] md:min-h-[800px] h-auto
      "
    >

      {/* bg-[url('https://images.pexels.com/photos/317356/pexels-photo-317356.jpeg')] */}

      {/* Background overlay (controls opacity) */}
      <div className="absolute inset-0 bg-type-b3" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-2 sm:px-4 py-8 md:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-type-1 leading-tight">
                Keep your notes and ideas
                <span className="block text-indigo-300">
                  organized in one place
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-type-1 leading-relaxed">
                <b>Re-Docs</b> is a simple platform to write, organize, and share
                notes. Save useful content from the web, structure your thoughts,
                and revisit them whenever you need.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none">
              <DottedButton
                text="Create Note"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/CreateNote");
                  } else {
                    navigate("/login");
                  }
                }}
              />
              <DottedButton
                text="Learn More"
                onClick={() => navigate("/about")}
              />
            </div>

            <div className="text-sm sm:text-base text-type-2 pt-4 max-w-xl">
              Built for individuals who want a clean space to store ideas,
              learning notes, and useful links - without unnecessary complexity.
            </div>
          </div>

          {/* Right side feature grid */}
          <div className="relative flex justify-center items-center p-2 sm:p-6 md:p-10 w-full">
            <div
              className="
                  flex flex-col flex-wrap justify-center
                  gap-3 sm:gap-4
                  w-full
                "
            >
              {boxes.map((box, index) => (
                <div
                  key={index}
                  className="
                    flex flex-col items-center
                    backdrop-blur-sm bg-type-1
                    p-4 sm:p-6
                    rounded-xl shadow-xl
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-2xl
                    border border-muted hover:border-muted2 hover:bg-type-2
                    box-border cursor-pointer
                  "
                >
                  <div
                    className="
                      w-8 h-8
                      rounded-lg
                      mb-2 sm:mb-3
                      flex items-center justify-center
                      backdrop-blur-sm
                      shrink-0  
                    "
                  >
                    <span className="text-lg">
                      {box.icon}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-type-4 text-center break-words">
                    {box.title}
                  </h3>

                  <p className="text-type-3 text-xs sm:text-sm text-center break-words">
                    {box.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

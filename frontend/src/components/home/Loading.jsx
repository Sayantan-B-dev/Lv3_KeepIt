import React from "react";
import { MoonLoader } from "react-spinners";

const Loading = ({ message = "Loading..." }) => (
  <div className="w-full h-full min-h-screen flex items-center justify-center">
    <div
      className="
        w-content
        flex items-center justify-center
        rounded-[10px]
        backdrop-blur-md
        shadow-2xl
        border-2 border-dashed border-white/60
        p-8
      "
      style={{
        background: "rgba(255,255,255,0.05)",
        boxShadow: "0 4px 32px rgba(31,38,135,0.1)",
      }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <MoonLoader
          color="#ffffff"
          size={44}
          speedMultiplier={0.85}
          aria-label="Loading Spinner"
        />

        <span className="text-xl font-semibold text-white animate-pulse">
          {message}
        </span>
        
        <span className="text-sm sm:text-base text-white/70 max-w-md">
          Please wait, the page is loading. This may take a few moments.
        </span>
      </div>
    </div>
  </div>
);

export default Loading;

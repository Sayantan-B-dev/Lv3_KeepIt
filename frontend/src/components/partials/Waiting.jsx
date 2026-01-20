import React from "react";

function Waiting({ errorText }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div
        className="
          w-content
          flex flex-col items-center justify-center
          text-[#16213e] font-sans
          shadow-lg p-8
          rounded-[10px]
        "
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.05)",
          border: "2px solid rgba(255, 255, 255, 0.4)",
        }}
      >
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#16213e] rounded-full animate-spin" />

        {/* Text */}
        <div className="mt-6 text-center">
          <span className="text-2xl font-bold text-white drop-shadow-sm mb-2 block animate-pulse">
            Please wait...
          </span>

          <span className="text-xl font-semibold text-red-600 tracking-wider block mb-2">
            Server Down!
          </span>

          <span className="text-xs text-gray-300 italic block mb-3">
            This page will reload every 10 seconds automatically until the server is online.
          </span>

          <p className="text-white text-sm sm:text-base">
            {errorText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Waiting;

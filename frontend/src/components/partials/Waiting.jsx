import React from "react";

function Waiting() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-[#16213e] font-sans rounded-2xl shadow-lg p-8 my-8 w-[70%] mx-auto"
    style={{
        backdropFilter: 'blur(2px)',
        backdropShadow: '20px',
        background: 'rgba(255, 255, 255, 0.01)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '60px',

    }}>
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#16213e] rounded-full animate-spin mx-auto"></div>
      <div className="mt-6 text-lg font-medium tracking-wide text-center">
        <span className="text-2xl font-bold text-[#16213e] drop-shadow-sm mb-2 block animate-pulse">
          Please wait...
        </span>
        <span className="text-xl font-semibold text-red-600 tracking-wider block mb-2">
          Server Down!
        </span>
        <span className="text-xs text-gray-500 italic mt-2 block">
          This page will reload every 1 min automatically until the server is online.
        </span>
      </div>
    </div>
  );
}

export default Waiting;

import React from "react";

const Loading = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-white via-indigo-50 to-blue-50">
    <div className="flex flex-col items-center gap-4">
      <svg
        className="animate-spin h-12 w-12 text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <span className="text-xl font-semibold text-indigo-700">{message}</span>
    </div>
  </div>
);

export default Loading;

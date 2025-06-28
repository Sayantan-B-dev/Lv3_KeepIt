import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-screen w-full"
  style={{
    backdropFilter: 'blur(2px)',
    backdropShadow: '20px',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
  }}
  >
    <div className="flex flex-col items-center gap-4">
      <ClipLoader
        color="#6366f1"
        size={48}
        speedMultiplier={0.85}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <span className="text-xl font-semibold text-indigo-700">{message}</span>
    </div>
  </div>
);

export default Loading;

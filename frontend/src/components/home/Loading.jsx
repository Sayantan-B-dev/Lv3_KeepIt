import React from "react";
import { MoonLoader } from "react-spinners";

const Loading = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center h-[300px] p-10 w-[90%] xl:w-fit mx-auto my-auto shadow-2xl rounded-2xl border-2 border-black border-dashed
    mt-8 sm:mt-20"
    style={{
      backdropFilter: 'blur(2px)',
      backdropShadow: '20px',
      background: 'rgba(255, 255, 255, 0.01)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
      borderRadius: '60px',
    }}
  >
    <div className="flex flex-col items-center gap-4">
      <MoonLoader
        color="#000000"
        size={48}
        speedMultiplier={0.85}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <span className="text-xl font-semibold text-indigo-600 animate-pulse">{message}</span>
      <span className="text-lg text-gray-600 mt-2">
        Please wait, the page is loading. This may take a few moments...
      </span>
    </div>
  </div>
);

export default Loading;

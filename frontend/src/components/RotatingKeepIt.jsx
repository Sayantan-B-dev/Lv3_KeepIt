import React from "react";
import RotatingText from "./advance/RotatingText";

const RotatingKeepIt = () => {
  return (
    <div className="flex justify-center items-center bg-transparent py-4 mb-10">
      <div
        className="
          flex items-center gap-3
          px-6 py-3
          rounded-xl
          bg-white/10 backdrop-blur-md
          border border-muted
          shadow-lg
        "
      >
        <span
          className="
            text-2xl sm:text-3xl md:text-4xl
            font-extrabold
            text-type-1
            tracking-tight
            drop-shadow
          "
        >
          Note
        </span>

        <RotatingText
          texts={[
            "Corner",
            "Ideas",
            "Thoughts",
            "Collections",
            "Finds",
            "Moments",
          ]}
          mainClassName="
            px-3 sm:px-4 md:px-6
            py-1 sm:py-2 md:py-3
            rounded-xl
            bg-white/10 backdrop-blur-md
            border border-muted
            text-type-3
            font-bold
            text-xl sm:text-2xl md:text-3xl
            shadow
            overflow-hidden
            justify-center
            items-center
          "
          staggerFrom="last"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
      </div>
    </div>
  );
};

export default RotatingKeepIt;

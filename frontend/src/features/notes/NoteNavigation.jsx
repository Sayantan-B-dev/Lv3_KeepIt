import React, { useState, useEffect } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaArrowUp
} from "react-icons/fa";

const NoteNavigation = ({ currentIndex, categoryNotes, goToNote }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const atStart = currentIndex <= 0;
  const atEnd = currentIndex === -1 || currentIndex >= categoryNotes.length - 1;

  // Handle scroll to show/hide bubble or just keep it always visible as requested
  // The user said "always visible", so I'll keep it always visible.

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const baseBtn = `
    p-2
    rounded-full
    transition-all duration-200
    flex items-center justify-center
    cursor-pointer
    hover:scale-110
    active:scale-95
  `;

  const enabled = `text-white/80 hover:text-white hover:bg-white/10`;
  const disabled = `text-white/20 cursor-not-allowed pointer-events-none`;

return (
  <div
    className="
      fixed
      inset-x-0
      bottom-[calc(env(safe-area-inset-bottom,0px)+14px)]
      sm:bottom-6
      z-[100]
      transition-all
      duration-300
      pointer-events-none
      w-full
    "
  >
    <div
      className="
        mx-auto
        w-fit
        max-w-[calc(100vw-1rem)]
        flex
        items-center
        gap-1.5
        p-1.5
        rounded-full
        glass-panel
        border
        border-white/20
        shadow-[0_8px_32px_rgba(0,0,0,0.5)]
        backdrop-blur-xl
        bg-black/60
        pointer-events-auto
      "
    >
      {/* Scroll to Top */}
      <div
        onClick={scrollToTop}
        className={`${baseBtn} text-sky-400 hover:text-sky-300 hover:bg-sky-400/10 border border-white/5 mr-1`}
        title="Scroll to top"
      >
        <FaArrowUp size={16} />
      </div>

      <div className="h-6 w-px bg-white/10 mx-1" />

      <div
        onClick={() => !atStart && goToNote(0)}
        className={`${baseBtn} ${atStart ? disabled : enabled}`}
        title="First note"
      >
        <FaAngleDoubleLeft size={16} />
      </div>

      <div
        onClick={() => !atStart && goToNote(currentIndex - 1)}
        className={`${baseBtn} ${atStart ? disabled : enabled}`}
        title="Previous note"
      >
        <FaAngleLeft size={18} />
      </div>

      <div className="px-3 font-mono text-xs text-type-2 tabular-nums whitespace-nowrap">
        {currentIndex + 1} / {categoryNotes.length}
      </div>

      <div
        onClick={() => !atEnd && goToNote(currentIndex + 1)}
        className={`${baseBtn} ${atEnd ? disabled : enabled}`}
        title="Next note"
      >
        <FaAngleRight size={18} />
      </div>

      <div
        onClick={() => !atEnd && goToNote(categoryNotes.length - 1)}
        className={`${baseBtn} ${atEnd ? disabled : enabled}`}
        title="Last note"
      >
        <FaAngleDoubleRight size={16} />
      </div>
    </div>
  </div>
);


};

export default NoteNavigation;

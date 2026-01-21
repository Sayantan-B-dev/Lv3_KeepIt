import React from "react";

const NoteNavigation = ({ currentIndex, categoryNotes, goToNote }) => {
  const atStart = currentIndex <= 0;
  const atEnd =
    currentIndex === -1 || currentIndex >= categoryNotes.length - 1;

  const baseBtn =
    `
      px-4 py-2
      rounded-lg
      border border-muted
      font-mono font-semibold
      shadow
      transition-all duration-150
      select-none
    `;

  const enabled =
    `
      cursor-pointer
      text-type-1
      hover:bg-white/20
      hover:translate-y-[-4px]
    `;

  const disabled =
    `
      text-type-3
      opacity-50
      cursor-not-allowed
    `;

  return (
    <div className="flex justify-center items-center mt-8 mb-4 gap-2 w-fit m-auto">
      {/* First */}
      <div
        onClick={() => !atStart && goToNote(0)}
        className={`${baseBtn} ${atStart ? disabled : enabled}`}
        title="First note"
      >
        {"<<"}
      </div>

      {/* Previous */}
      <div
        onClick={() => !atStart && goToNote(currentIndex - 1)}
        className={`${baseBtn} ${atStart ? disabled : enabled}`}
        title="Previous note"
      >
        {"<"}
      </div>

      {/* Next */}
      <div
        onClick={() => !atEnd && goToNote(currentIndex + 1)}
        className={`${baseBtn} ${atEnd ? disabled : enabled}`}
        title="Next note"
      >
        {">"}
      </div>

      {/* Last */}
      <div
        onClick={() => !atEnd && goToNote(categoryNotes.length - 1)}
        className={`${baseBtn} ${atEnd ? disabled : enabled}`}
        title="Last note"
      >
        {">>"}
      </div>
    </div>
  );
};

export default NoteNavigation;

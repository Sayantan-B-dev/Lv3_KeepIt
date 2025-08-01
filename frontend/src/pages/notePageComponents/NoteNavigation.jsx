import React from "react";

const NoteNavigation = ({ currentIndex, categoryNotes, goToNote }) => (
  <div className="flex justify-between items-center mt-8 mb-4 gap-2 w-fit m-auto">
    <div
      onClick={() => goToNote(0)}
      disabled={currentIndex <= 0}
      className={`cursor-pointer px-4 py-2 rounded border border-black font-semibold shadow transition ${currentIndex <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-100'}`}
      title="First note"
    >
      {"<<"}
    </div>
    <div
      onClick={() => goToNote(currentIndex - 1)}
      disabled={currentIndex <= 0}
      className={`cursor-pointer px-4 py-2 rounded border border-black font-semibold shadow transition ${currentIndex <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-100'}`}
      title="Previous note"
    >
      {"<"}
    </div>
    <div
      onClick={() => goToNote(currentIndex + 1)}
      disabled={currentIndex === -1 || currentIndex >= categoryNotes.length - 1}
      className={`cursor-pointer px-4 py-2 rounded border border-black font-semibold shadow transition ${currentIndex === -1 || currentIndex >= categoryNotes.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-100'}`}
      title="Next note"
    >
      {">"}
    </div>
    <div
      onClick={() => goToNote(categoryNotes.length - 1)}
      disabled={currentIndex === -1 || currentIndex >= categoryNotes.length - 1}
      className={`cursor-pointer px-4 py-2 rounded border border-black font-semibold shadow transition ${currentIndex === -1 || currentIndex >= categoryNotes.length - 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-100'}`}
      title="Last note"
    >
      {">>"}
    </div>
  </div>
);

export default NoteNavigation;
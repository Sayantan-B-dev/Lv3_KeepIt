import React from "react";

const NoteModal = ({ noteModalOpen, openNote, closeNoteModal, noteContentHtml }) => {
  if (!noteModalOpen || !openNote) return null;

  // Close when clicking the backdrop (but not the modal itself)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeNoteModal();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{
        zIndex: 9999,
        overscrollBehavior: 'contain',
      }}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl p-4 sm:p-8 border border-gray-200 relative flex flex-col
          w-[98vw] xs:w-[95vw] sm:w-[90vw] md:w-[700px] lg:w-[900px] xl:w-[1100px] max-w-[98vw] md:max-w-[90vw] lg:max-w-[900px] xl:max-w-[1100px]
        `}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          minHeight: '0',
        }}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={closeNoteModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold z-10"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="mb-4 mt-6 sm:mt-0">
          <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ wordBreak: "break-all" }}>{openNote.title}</h2>
          <div className="text-xs text-gray-500 mb-2">Created: {new Date(openNote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div className="mb-4 flex-1">
          <div
            className="bg-white/40 rounded-xl px-3 py-2 shadow border border-gray-200 whitespace-pre-line text-gray-800"
            style={{ minHeight: 60 }}
            dangerouslySetInnerHTML={{ __html: noteContentHtml }}
          />
        </div>
        <div className="text-center mt-4">
          <button
            onClick={closeNoteModal}
            className="px-6 py-2 rounded-lg font-semibold shadow bg-indigo-100 text-indigo-700 border border-indigo-300 hover:bg-indigo-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal; 
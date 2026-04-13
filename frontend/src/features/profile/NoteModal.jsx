import React from "react";
import { useNavigate } from "react-router-dom";

const NoteModal = ({ noteModalOpen, openNote, closeNoteModal, noteContentHtml }) => {
  const navigate = useNavigate();
  if (!noteModalOpen || !openNote) return null;

  // Close when clicking the backdrop (but not the modal itself)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeNoteModal();
    }
  };

  // Prepare tags display
  const tags = openNote.tags && openNote.tags.length > 0
    ? openNote.tags.map((tag, idx) => (
        <span
          key={idx}
          className="backdrop-blur-md bg-black/80 border border-black px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer hover:bg-black/10 transition text-white hover:text-black shadow-sm"
          style={{
            boxShadow: '0 2px 8px 0 rgba(31,38,135,0.05)',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
          onClick={() => {
            closeNoteModal();
            navigate(`/tag/${encodeURIComponent(tag)}`);
          }}
        >
          #{tag}
        </span>
      ))
    : <span className="text-gray-400 text-xs">No tags</span>;

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
          bg-white rounded-xl shadow-xl p-2 xs:p-3 sm:p-4 border border-gray-200 relative flex flex-col
          w-[96vw] xs:w-[92vw] sm:w-[85vw] md:w-[500px] lg:w-[700px] xl:w-[900px] max-w-[96vw] md:max-w-[85vw] lg:max-w-[700px] xl:max-w-[900px]
        `}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          minHeight: '0',
        }}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div
          onClick={closeNoteModal}
          className="absolute top-3 right-3 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/80 border border-gray-300 shadow-lg cursor-pointer transition hover:bg-red-100 hover:border-red-400 group"
          aria-label="Close"
          title="Close"
          style={{
            boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <span className="text-2xl font-bold text-gray-500 group-hover:text-red-500 transition-all" style={{lineHeight: 1}}>&times;</span>
        </div>
        <div className="mb-3 mt-5 sm:mt-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2" style={{ wordBreak: "break-all" }}>{openNote.title}</h2>
          {/* Tags under the title */}
          <div className="mb-1 flex flex-wrap items-center gap-1">{tags}</div>
          <div className="text-xs text-gray-500 mb-1">Created: {new Date(openNote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        <div className="mb-3 flex-1">
          <div
            className="bg-white/40 rounded-lg px-2 py-1 sm:px-3 sm:py-2 shadow border border-gray-200 whitespace-pre-line text-gray-800 text-sm sm:text-base"
            style={{ minHeight: 40 }}
            dangerouslySetInnerHTML={{ __html: noteContentHtml }}
          />
        </div>
        <div className="text-center mt-3">
          <button
            onClick={closeNoteModal}
            className="px-4 py-1.5 rounded-md font-semibold shadow bg-indigo-100 text-indigo-700 border border-indigo-300 hover:bg-indigo-200 transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal; 

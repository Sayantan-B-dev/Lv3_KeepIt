import React from "react";
import MathContent from "./MathContent";

const NoteContent = ({
  editMode,
  editNote,
  handleInputChange,
  updateLoading,
  contentTooLarge,
  CONTENT_MAX_LENGTH,
  note,
}) => (
  <div className="my-8">
    <h2 className="font-semibold text-black mb-2 text-lg">Content : </h2>
    {editMode ? (
      <>
        {contentTooLarge && (
          <div className="mb-2 text-red-500 text-center">
            {CONTENT_MAX_LENGTH
              ? `Content is too long to edit (max ${CONTENT_MAX_LENGTH} characters).`
              : "Content is too large to edit in this field."}
          </div>
        )}
        <textarea
          name="content"
          value={editNote.content}
          onChange={handleInputChange}
          className="w-full h-200 border border-indigo-200 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-300"
          rows={16}
          maxLength={CONTENT_MAX_LENGTH}
          disabled={updateLoading || contentTooLarge}
          style={contentTooLarge ? { background: "#fef2f2" } : {}}
        />
      </>
    ) : (
      <div className="bg-white/40 rounded-xl px-5 py-4 shadow-lg  border-1 border-black whitespace-pre-line text-gray-800">
        <MathContent content={note.content} />
      </div>
    )}
  </div>
);

export default NoteContent;
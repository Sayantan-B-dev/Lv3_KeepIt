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
    {editMode ? (
      <>
        {contentTooLarge && (
          <div className="mb-3 text-red-500 text-sm text-center font-mono">
            {CONTENT_MAX_LENGTH
              ? `Content is too long to edit (max ${CONTENT_MAX_LENGTH} characters).`
              : "Content is too large to edit in this field."}
          </div>
        )}

        <textarea
          name="content"
          value={editNote.content}
          onChange={handleInputChange}
          rows={16}
          maxLength={CONTENT_MAX_LENGTH}
          disabled={updateLoading || contentTooLarge}
          className="
            w-full
            rounded-xl
            border border-muted
            px-4 py-3
            font-mono text-sm
            text-type-1
            bg-transparent
            focus:outline-none
            focus:ring-1
            focus:ring-white/30
            transition
          "
          style={
            contentTooLarge
              ? { background: "rgba(255,255,255,0.05)" }
              : {}
          }
        />
      </>
    ) : (
      <div
        className="
          rounded-xl
          px-5 py-4
          border border-muted
          shadow-xl
          glass-panel
          text-type-1
          font-mono
        "
      >
        <MathContent content={note.content} />
      </div>
    )}
  </div>
);

export default NoteContent;

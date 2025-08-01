import React from "react";

const NoteTags = ({
  editMode,
  editTags,
  handleRemoveTag,
  newTag,
  handleInputChange,
  handleAddTag,
  updateLoading,
  setNewTag,
  note,
  navigate,
}) => {
  return (
    <>
      {editMode ? (
        <div className="flex flex-col gap-2 mt-3 justify-center items-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {editTags.length === 0 && (
              <span className="text-gray-400 text-xs">No tags</span>
            )}
            {editTags.map((tag, idx) => (
              <span
                key={tag + idx}
                className="backdrop-blur-md bg-black/80 border border-black px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 text-white shadow-sm"
                style={{
                  boxShadow: '0 2px 8px 0 rgba(31,38,135,0.05)',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
              >
                #{tag}
                <button
                  type="button"
                  className="ml-1 text-white hover:text-red-600 text-xs font-bold focus:outline-none"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                  style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2 items-center">
            <input
              type="text"
              name="newTag"
              value={newTag}
              onChange={handleInputChange}
              className="border border-blue rounded-full px-3 py-1 text-xs focus:outline-none focus:ring focus:border-black bg-white/20 backdrop-blur-md text-black shadow-sm"
              placeholder="Add tag"
              autoComplete="off"
              onKeyDown={e => {
                if (e.key === "Enter") e.preventDefault();
              }}
              disabled={updateLoading}
              style={{
                background: 'rgba(255,255,255,0.15)',
                boxShadow: '0 2px 8px 0 rgba(31,38,135,0.05)',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={updateLoading || !newTag.trim()}
              aria-label="Add tag"
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #000",
                background: "white",
                color: "#000",
                fontSize: "14px",
                fontWeight: "bold",
                padding: 0,
                margin: 0,
                lineHeight: 1,
                cursor: updateLoading || !newTag.trim() ? "not-allowed" : "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>
      ) : (
        Array.isArray(note.tags) && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {note.tags.map((tag, idx) => (
              <span
                key={tag + idx}
                className="backdrop-blur-md bg-black/80 border border-black px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:bg-black/10 transition text-white hover:text-black  shadow-sm"
                style={{
                  boxShadow: '0 2px 8px 0 rgba(31,38,135,0.05)',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
                onClick={() => navigate(`/tag/${encodeURIComponent(tag)}`)}
                title={`View all notes with tag: ${tag}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )
      )}
    </>
  );
};

export default NoteTags;
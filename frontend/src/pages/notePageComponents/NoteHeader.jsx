import React from "react";
import DottedButton2 from "../../components/buttons/DottedButton2";
import { motion } from "framer-motion";
import ConfirmPopUp from "../../components/ConfirmPopUp";
import ButtonType3 from "../../components/buttons/ButtonType3";
const NoteHeader = ({
  note,
  user,
  isOwner,
  editMode,
  editNote,
  editTags,
  newTag,
  setNewTag,
  updateLoading,
  handleInputChange,
  handleEdit,
  handleDelete,
  deleting,
  category,
  handleCategoryClick,
  handleCancel,
  handleSave,
  handleAddTag,
  handleRemoveTag,
  isAuthenticated,
  onUserClick,
  navigate,
}) => {
  const [tagToDelete, setTagToDelete] = React.useState(null);
  React.useEffect(() => {
    if (!editMode) setTagToDelete(null);
  }, [editMode]);

  return (
    <div className="flex justify-center mb-8">
      {/* Tag delete confirmation */}
      <ConfirmPopUp
        open={!!tagToDelete}
        title="Remove Tag"
        message={
          tagToDelete
            ? `Are you sure you want to remove the tag "${tagToDelete}"?`
            : ""
        }
        onClose={() => setTagToDelete(null)}
        onConfirm={() => {
          handleRemoveTag(tagToDelete);
          setTagToDelete(null);
        }}
        loading={false}
      />

      <div className="w-full p-6 border border-muted rounded-t-lg shadow-xl glass-panel flex flex-col items-center gap-4 font-mono">

        {/* Profile */}
        {isAuthenticated && user && (
          <div
            className="mb-3 flex flex-col items-center gap-2 cursor-pointer border border-muted p-4 rounded-lg bg-type-2 w-full"
          >
            {user?.profileImage?.url ? (
              <motion.img
                src={user.profileImage.url}
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover border border-muted"
                whileHover={{
                  scale: 1.25,
                  rotate: 5,
                  filter: "brightness(1.1)",
                }}
                onClick={() => onUserClick?.(user._id)}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-type-1 flex items-center justify-center text-type-2 font-bold" onClick={() => onUserClick?.(user._id)}>
                {user?.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <span className="text-sm text-type-1 underline-animation" onClick={() => onUserClick?.(user._id)}>
              {user?.username}
            </span>
          </div>
        )}

        {/* Title */}
        <div className="w-full">
          {editMode ? (
            <input
              name="title"
              value={editNote.title}
              onChange={handleInputChange}
              disabled={updateLoading}
              className="w-full text-center text-xl border border-muted rounded px-3 py-2 bg-transparent"
            />
          ) : (
            <div className="text-xl text-center border-b border-muted py-2">
              {note.title}
            </div>
          )}
        </div>

        {/* Meta row: created date + delete */}
        <div className="flex justify-between items-center w-full text-xs text-type-3">
          <span className="flex items-center gap-1">
            <span className="text-type-2">Created:</span>
            {new Date(note.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>

          {isOwner && !editMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete note"
              className="
                p-1 rounded-full
                border border-muted
                text-type-3
                hover:text-black hover:bg-red-500
                hover:translate-y-[-4px]
                active:scale-95
                transition-all duration-150
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {deleting ? "…" : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m5 0H4"
                  />
                </svg>
              )}
            </button>
          )}

        </div>

        {/* Category & Tags */}
        <div className="flex flex-row items-start w-full gap-2">
          <div className="flex flex-col items-start w-full gap-2 text-sm mt-2">

            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-mono">Category:</span>
              <DottedButton2
                text={category?.name || note.category}
                onClick={() => handleCategoryClick(category._id)}
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-mono">Tags:</span>

              {(editMode ? editTags : note.tags || []).map((tag, i) => (
                <span
                  key={tag + i}
                  className="px-3 py-1 rounded-full text-xs border border-muted bg-type-2 shadow flex items-center gap-1"
                  onClick={
                    !editMode
                      ? () => navigate(`/tag/${encodeURIComponent(tag)}`)
                      : undefined
                  }
                >
                  #{tag}

                  {editMode && (
                    <button
                      type="button"
                      disabled={updateLoading}
                      title="Remove tag"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTagToDelete(tag);
                      }}
                      className="ml-1 text-red-500 hover:text-red-700 disabled:opacity-40"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            {editMode && (
              <div className="flex gap-2">
                <input
                  name="newTag"
                  value={newTag}
                  onChange={handleInputChange}
                  className="px-3 py-1 text-xs rounded-full border border-muted bg-transparent"
                  placeholder="Add tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="px-2 rounded-full border border-muted"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          {isOwner && (
            <div className="flex gap-3 mt-3">
              {!editMode ? (
                <ButtonType3
                  text="Edit"
                  onClick={handleEdit}
                />
              ) : (
                <>
                  <ButtonType3
                    text="Save"
                    onClick={handleSave}
                  />
                  <ButtonType3
                    text="Cancel"
                    onClick={handleCancel}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteHeader;

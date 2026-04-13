import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DottedButton2, ButtonType3 } from "@/components/ui/buttons";
import { ConfirmPopUp } from "@/components/ui";
import TrashIcon from "@/assets/svg/TrashIcon";

// ──────────────────────────────────────────────────────────────────────────────
// Internal Sub-components (for structural clarity)
// ──────────────────────────────────────────────────────────────────────────────

const UserProfile = ({ user, onUserClick }) => (
  <div
    onClick={() => onUserClick?.(user._id)}
    className="mb-3 flex flex-col items-center gap-2 cursor-pointer border border-muted p-4 rounded-lg bg-type-2 w-full transition-all hover:bg-white/5"
  >
    {user?.profileImage?.url ? (
      <motion.img
        src={user.profileImage.url}
        alt={user.username}
        className="w-14 h-14 rounded-full object-cover border border-muted"
        whileHover={{ scale: 1.1, rotate: 2 }}
      />
    ) : (
      <div className="w-14 h-14 rounded-full bg-type-1 flex items-center justify-center text-type-2 font-bold border border-muted">
        {user?.username?.[0]?.toUpperCase() || "?"}
      </div>
    )}
    <span className="text-sm text-type-1 underline-animation">
      {user?.username}
    </span>
  </div>
);

const TagItem = ({ tag, i, editMode, updateLoading, onRemove, onTagClick }) => (
  <span
    className="px-3 py-1 rounded-full text-xs border border-muted bg-type-2 shadow flex items-center gap-1 max-w-full"
    onClick={!editMode ? onTagClick : undefined}
  >
    <span className={!editMode ? "truncate cursor-pointer hover:text-white" : "truncate"}>
      #{tag}
    </span>
    {editMode && (
      <button
        type="button"
        disabled={updateLoading}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(tag);
        }}
        className="ml-1 text-red-500 hover:text-red-700 disabled:opacity-40"
      >
        ×
      </button>
    )}
  </span>
);

// ──────────────────────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────────────────────

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
  onDownloadNote,
}) => {
  const [tagToDelete, setTagToDelete] = useState(null);

  useEffect(() => {
    if (!editMode) setTagToDelete(null);
  }, [editMode]);

  return (
    <div className="flex justify-center mb-8 font-mono">
      <ConfirmPopUp
        open={!!tagToDelete}
        title="Remove Tag"
        message={tagToDelete ? `Remove the tag "${tagToDelete}"?` : ""}
        onClose={() => setTagToDelete(null)}
        onConfirm={() => {
          handleRemoveTag(tagToDelete);
          setTagToDelete(null);
        }}
      />

      <div className="w-full p-6 border border-muted rounded-t-lg shadow-xl glass-panel flex flex-col items-center gap-4">
        
        {/* Section 1: User Profile */}
        {isAuthenticated && user && (
          <UserProfile user={user} onUserClick={onUserClick} />
        )}

        {/* Section 2: Title & Visibility */}
        <div className="w-full space-y-3">
          {editMode ? (
            <input
              name="title"
              value={editNote.title}
              onChange={handleInputChange}
              disabled={updateLoading}
              className="w-full text-center text-xl border border-muted rounded px-3 py-2 bg-transparent focus:ring-1 focus:ring-white/30 outline-none"
            />
          ) : (
            <div className="text-xl text-center border-b border-muted py-2 flex items-center justify-center gap-2">
              {note.isPrivate && (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm4 10.723V20h-2v-2.277a1.993 1.993 0 01.567-3.677 2.001 2.001 0 011.433 3.677z" /></svg>
              )}
              <span className="break-all max-w-full leading-snug">{note.title}</span>
            </div>
          )}

          {editMode && (
            <div className="flex justify-center items-center gap-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isPrivate"
                    checked={editNote.isPrivate}
                    onChange={(e) => handleInputChange({ target: { name: 'isPrivate', value: e.target.checked } })}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors ${editNote.isPrivate ? 'bg-white/40' : 'bg-white/20'}`} />
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${editNote.isPrivate ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-xs text-type-2 group-hover:text-type-1 transition-colors">
                  {editNote.isPrivate ? "Private (Hidden)" : "Public (Community)"}
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Section 3: Metadata (Created Date & Actions) */}
        <div className="flex justify-between items-center w-full text-xs text-type-3 border-b border-muted pb-3">
          <span className="flex items-center gap-1">
            <span className="text-type-2">Created:</span>
            {new Date(note.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric"
            })}
          </span>

          {isOwner && !editMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="p-1 rounded-full border border-muted text-type-3 hover:text-black hover:bg-red-500 transition-all"
            >
              {deleting ? "…" : <TrashIcon />}
            </button>
          )}
        </div>

        {/* Section 4: Categorization */}
        <div className="flex flex-col w-full gap-4 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-type-2">Category:</span>
              <DottedButton2
                text={category?.name || note.category}
                onClick={() => handleCategoryClick(category?._id || note.category)}
              />
            </div>

            {isOwner && (
              <div className="flex gap-2">
                {!editMode ? (
                  <ButtonType3 text="Edit Note" onClick={handleEdit} />
                ) : (
                  <>
                    <ButtonType3 text="Save" onClick={handleSave} />
                    <ButtonType3 text="Cancel" onClick={handleCancel} />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Section 5: Knowledge Tags */}
          <div className="flex flex-col gap-2">
            <span className="text-type-2">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {(editMode ? editTags : note.tags || []).map((tag, i) => (
                <TagItem
                  key={`${tag}-${i}`}
                  tag={tag}
                  editMode={editMode}
                  updateLoading={updateLoading}
                  onRemove={() => setTagToDelete(tag)}
                  onTagClick={() => navigate(`/tag/${encodeURIComponent(tag)}`)}
                />
              ))}
              
              {editMode && (
                <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                  <input
                    name="newTag"
                    value={newTag}
                    onChange={handleInputChange}
                    className="px-3 py-1 text-xs rounded-full border border-muted bg-transparent w-full sm:w-auto outline-none focus:ring-1 focus:ring-white/20"
                    placeholder="Add tag..."
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="px-3 py-1 rounded-full border border-muted hover:bg-white/5 transition-colors"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NoteHeader;

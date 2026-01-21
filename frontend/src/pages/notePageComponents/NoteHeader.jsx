import React from "react";
import DottedButton2 from "../../components/buttons/DottedButton2";

const NoteHeader = ({
  note,
  user,
  isOwner,
  editMode,
  editNote,
  handleInputChange,
  updateLoading,
  handleEdit,
  handleDelete,
  deleting,
  setShowDeletePopup,
  showDeletePopup,
  contentTooLarge,
  category,
  handleCategoryClick,
  EncryptButton,
  newTag,
  handleAddTag,
  editTags,
  handleRemoveTag,
  setNewTag,
  updateError,
  updateSuccess,
  handleCancel,
  handleSave,
  ...rest
}) => {
  return (
    <div className="flex items-center gap-6 mb-8  justify-center">
      <div className="relative flex flex-col  justify-center  border-2 border-black rounded-xl p-10">
        <p className="text-sm font-extrabold text-type-1 flex items-center gap-2 text-center justify-center">
          Title:
        </p>
        <div>
          {editMode ? (
            <input
              type="text"
              name="title"
              value={editNote.title}
              onChange={handleInputChange}
              className="text-lg sm:text-xl md:text-2xl font-extrabold text-type-1 border border-grayi5digo-200 rounded px-2 py-1"
              maxLength={100}
              disabled={updateLoading}
            />
          ) : (
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-type-1 flex ienter text-center justify-center gap-2" style={{ wordBreak: "break-all" }}>
              {note.title}
            </h3>
          )}
        </div>
        {/* Tags under title */}
        {/* ...tags and edit controls can be extracted to NoteTags if needed... */}
        <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium justify-between w-full">
          <span className="flex items-center gap-1 text-xs    ">
            <span className="text-xs text-gray-400">Created:</span>
            {new Date(note.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          {isOwner && !editMode && (
            <button
              className="ml-4 p-1 rounded-full text-gray-400 hover:text-red-500 transition cursor-pointer"
              onClick={() => setShowDeletePopup(true)}
              disabled={deleting}
              title="Delete this note"
              style={{ background: "none", border: "none", outline: "none" }}
            >
              {deleting ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m5 0H4" />
                </svg>
              )}
            </button>
          )}
        </div>
        {/* Category */}
        <div className="flex items-center gap-4 m-auto ">
          <span className="block font-semibold text-gray-700">Category:</span>
          <DottedButton2
            style={{ fontSize: "12px" }}
            onClick={() => handleCategoryClick(category._id)}
            text={category?.name || note.category}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteHeader;
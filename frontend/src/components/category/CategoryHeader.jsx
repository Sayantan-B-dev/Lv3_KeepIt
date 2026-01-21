import { motion, AnimatePresence } from "framer-motion";
import DottedButton from "../buttons/DottedButton"

const CategoryHeader = ({
  category,
  user,
  isOwner,
  editMode,
  editName,
  editType,
  saving,
  // dragActive,

  onEditNameChange,
  onEditTypeChange,
  onEditSave,
  onEditCancel,
  onEditClick,
  onDeleteClick,
  onDownloadAll,
  onCreateNote,
  isAuthenticated,
  dragHandlers,
}) => {
  return (
    <div
      className={`w-full mx-auto p-6 shadow-xl border border-muted mb-2 relative w-full rounded-t-lg`}
      {...dragHandlers}
    >
      {/* Profile */}
      {isAuthenticated && user && (
        <div
          className="mb-3 flex flex-col items-center gap-2 cursor-pointer border border-muted p-4 rounded-lg bg-type-2"
          onClick={() => navigate("/profile/MyProfile")}
        >
          {user?.profileImage?.url ? (
            <motion.img
              src={user.profileImage.url}
              alt={user.username}
              className="w-14 h-14 rounded-full object-cover border border-muted shadow-2xl"
              whileHover={{
                scale: 1.25,
                rotate: 5,
                filter: "brightness(1.1)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            />
          ) : (
            <motion.div
              className="
          w-14 h-14 rounded-full
          bg-type-1
          flex items-center justify-center
          text-2xl font-bold text-type-2
          border border-muted shadow-2xl
        "
              whileHover={{
                scale: 1.25,
                rotate: 5,
                filter: "brightness(1.1)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {user?.username?.[0]?.toUpperCase() || "?"}
            </motion.div>
          )}

          {/* Static username */}
          <span className="text-sm font-mono text-type-1 truncate underline-animation">
            {user?.username}
          </span>
        </div>
      )}

      {/* Category Header */}
      <div className="flex items-center justify-center gap-6 mb-2">
        <div className="flex flex-col items-center">
          <div className="text-xl sm:text-lg font-mono flex flex-col items-center gap-2 rounded-xl px-3 py-2 mb-7 shadow-xl">

            {editMode ? (
              <>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold">Category:</span>
                  <input
                    type="text"
                    className="border px-3 py-2 text-xl border-muted rounded-lg"
                    value={editName}
                    onChange={onEditNameChange}
                    placeholder="Category Name"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full mt-2">
                  <div className="flex gap-2 items-center">
                    <span className="text-sm font-semibold">Type:</span>
                    <input
                      type="text"
                      className="border px-3 py-2 text-xl border-muted rounded-lg"
                      value={editType}
                      onChange={onEditTypeChange}
                      placeholder="Type (single word)"
                    />
                  </div>

                  <div className="flex gap-2 justify-center gap-x-4 mt-2">
                    <div
                      className="text-type-1 text-sm px-3 py-1 rounded-lg font-mono shadow border border-muted cursor-pointer hover:bg-white/20  hover:translate-y-[-4px] transition-all duration-150 scale-111"
                      onClick={onEditSave}
                      disabled={saving}
                    >
                      Save
                    </div>
                    <div
                      className="text-type-1 text-sm px-3 py-1 rounded-lg font-mono shadow border border-muted cursor-pointer hover:bg-white/20  hover:translate-y-[-4px] transition-all duration-150 scale-111"
                      onClick={onEditCancel}
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p
                  className="text-lg text-type-3 font-mono text-center border-b border-muted px-3 py-2"
                  style={{ wordBreak: "break-all" }}
                >
                  <span className="text-type-1 font-semibold">Category :</span> {category.name}
                </p>

                <div className="flex flex-col font-mono  items-center gap-2 w-full">
                  <div className="flex gap-2">
                    <span className="text-md font-semibold">Type :</span>
                    <span className="text-md text-type-3">
                      {category.type || (
                        <span className="italic">(none)</span>
                      )}
                    </span>
                  </div>

                  {isOwner && (
                    <div className="flex gap-2 mt-2">
                      <div
                        className="p-1 rounded-full text-type-3 hover:text-black hover:bg-red-500 cursor-pointer border border-muted hover:translate-y-[-4px] transition-all duration-150"
                        onClick={onDeleteClick}
                        title="Delete this category"
                      >
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
                      </div>

                      <div
                        className="text-type-1 text-sm px-3 py-1 rounded-lg font-mono shadow border border-muted cursor-pointer hover:bg-white/20  hover:translate-y-[-4px] transition-all duration-150"
                        onClick={onEditClick}
                      >
                        Edit
                      </div>

                      <div
                        className="text-type-1 text-sm px-3 py-1 rounded-lg font-mono shadow border border-muted cursor-pointer hover:bg-white/20   hover:translate-y-[-4px] transition-all duration-150"

                        onClick={onDownloadAll}
                      >
                        Download All (ZIP)
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>


          <DottedButton text="Add a new Note" onClick={onCreateNote} />

        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;

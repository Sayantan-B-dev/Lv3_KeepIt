import { motion, AnimatePresence } from "framer-motion";
import { DottedButton } from "@/components/ui/buttons";
import TrashIcon from "@/assets/svg/TrashIcon";

const CategoryHeader = ({
  category,
  user,
  isOwner,
  totalNotesCount,
  editMode,
  editName,
  editType,
  saving,
  onUserClick,
  onEditNameChange,
  onEditTypeChange,
  onEditSave,
  onEditCancel,
  onEditClick,
  onDeleteClick,
  onCreateNote,
  onBulkTagClick,
  onBulkDeleteClick,
  selectedNotesCount,
  isAuthenticated,
  dragHandlers,
  loggedInUser,
  onOpenProModal
}) => {
  const isPro = loggedInUser?.isPro || loggedInUser?.isPremium;

  const handleProAction = (callback) => {
    if (!isPro) {
      onOpenProModal();
      return;
    }
    callback();
  };

  const downloadCategoryZip = async (catId) => {
    try {
      window.location.href = `${axiosInstance.defaults.baseURL}/api/notes/category/${catId}/download`;
    } catch (err) {
      toast.error("Failed to start download.");
    }
  };

  return (
    <div
      className={`w-full mx-auto p-6 shadow-xl border border-muted mb-2 relative rounded-t-lg`}
      {...dragHandlers}
    >
      {/* Profile */}
      {isAuthenticated && user && (
        <div
          className="mb-3 flex flex-col items-center gap-2 cursor-pointer border border-muted p-4 rounded-lg bg-type-2"
        >
          <div className="relative">
            {user?.profileImage?.url ? (
              <motion.img
                src={user.profileImage.url}
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover border border-muted shadow-2xl"
                whileHover={{ scale: 1.25, rotate: 5, filter: "brightness(1.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => onUserClick?.(user._id)}
              />
            ) : (
              <motion.div
                className="w-14 h-14 rounded-full bg-type-1 flex items-center justify-center text-2xl font-bold text-type-2 border border-muted shadow-2xl"
                whileHover={{ scale: 1.25, rotate: 5, filter: "brightness(1.1)" }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => onUserClick?.(user._id)}
              >
                {user?.username?.[0]?.toUpperCase() || "?"}
              </motion.div>
            )}
            
            {(user?.isPro || user?.isPremium) && (
              <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-1 rounded border border-black shadow-lg">
                PRO
              </div>
            )}
          </div>

          <span className="text-sm font-mono text-type-1 truncate underline-animation" onClick={() => onUserClick?.(user._id)}>
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
                      className="text-type-1 text-sm px-3 py-1 rounded-lg font-mono shadow border border-muted cursor-pointer hover:bg-white/20 hover:translate-y-[-4px] transition-all duration-150 scale-111"
                      onClick={onEditSave}
                    >
                      Save
                    </div>
                    <div
                      className="text-type-1 text-sm px-3 py-1 rounded-lg font-mono shadow border border-muted cursor-pointer hover:bg-white/20 hover:translate-y-[-4px] transition-all duration-150 scale-111"
                      onClick={onEditCancel}
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg text-type-3 font-mono text-center border-b border-muted px-3 py-2" style={{ wordBreak: "break-all" }}>
                  <span className="text-type-1 font-semibold">Category :</span> {category.name}
                </p>

                <div className="flex flex-col font-mono items-center gap-2 w-full">
                  <div className="flex gap-2">
                    <span className="text-md font-semibold">Type :</span>
                    <span className="text-md text-type-3">
                      {category.type || <span className="italic">(none)</span>}
                    </span>
                  </div>

                  <div className="flex gap-2 text-type-2 font-mono text-sm py-1">
                    <span className="font-semibold text-type-1 border border-muted px-2 py-0.5 rounded-md bg-white/5">
                      {totalNotesCount} Notes
                    </span>
                  </div>

                  {isOwner && (
                    <div className="flex gap-2 mt-2">
                      <div
                        className="p-1 rounded-full text-type-3 hover:text-black hover:bg-red-500 cursor-pointer border border-muted hover:translate-y-[-4px] transition-all duration-150"
                        onClick={onDeleteClick}
                        title="Delete this category"
                      >
                        <TrashIcon />
                      </div>
                      <div
                        className="text-type-1 text-sm px-3 py-1 rounded-lg font-mono shadow border border-muted cursor-pointer hover:bg-white/20 hover:translate-y-[-4px] transition-all duration-150"
                        onClick={onEditClick}
                      >
                        Edit
                      </div>
                    </div>
                  )}

                  {isAuthenticated && (
                    <div className="mt-2 flex flex-col gap-2 items-center">
                      <div
                        className={`text-type-1 text-sm px-4 py-2 rounded-lg font-mono shadow border border-muted cursor-pointer hover:bg-white/20 hover:translate-y-[-4px] transition-all duration-150 w-fit flex items-center gap-2 ${!isPro ? "opacity-70" : "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50"}`}
                        onClick={() => handleProAction(() => downloadCategoryZip(category._id))}
                        title={isPro ? "Download all notes as ZIP" : "Pro Feature: ZIP Download"}
                      >
                        {isPro ? "🚀 ZIP Archive" : "🔒 ZIP Archive (Pro)"}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {isOwner && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 p-4 border border-dashed border-muted rounded-xl bg-white/5">
                <DottedButton text="Add Note" onClick={onCreateNote} className="!py-2 !px-4" />
                
                <DottedButton
                  text={
                    isPro 
                      ? (selectedNotesCount > 0 ? `Bulk Tag (${selectedNotesCount})` : "Bulk Tag Mode")
                      : `🔒 Bulk Tag (Pro)`
                  }
                  onClick={() => handleProAction(onBulkTagClick)}
                  className={`!py-2 !px-4 ${selectedNotesCount > 0 ? "!bg-blue-500/20 !border-blue-500/50" : ""} ${!isPro ? "opacity-70" : ""}`}
                />

                <DottedButton
                  text={selectedNotesCount > 0 ? `Delete Notes (${selectedNotesCount})` : "Bulk Delete Mode"}
                  onClick={onBulkDeleteClick}
                  className={`!py-2 !px-4 ${selectedNotesCount > 0 ? "!bg-red-500/20 !border-red-500/50 !text-red-400" : ""}`}
                />
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;

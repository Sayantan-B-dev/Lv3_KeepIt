import { motion } from "framer-motion";
import { DottedButton } from "@/components/ui/buttons";
import TrashIcon from "@/assets/svg/TrashIcon";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";

// --- Sub-Components ---

const UserProfile = ({ user, onUserClick, isAuthenticated }) => {
  if (!isAuthenticated || !user) return null;
  
  return (
    <div
      className="mb-3 flex flex-col items-center gap-2 cursor-pointer border border-muted p-4 rounded-lg bg-type-2 relative overflow-hidden group transition-all"
      style={user.coverImage?.url ? {
        backgroundImage: `url(${user.coverImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      {user.coverImage?.url && (
        <div className="absolute inset-0 bg-black/80 group-hover:bg-black/60 transition-colors duration-300" />
      )}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="relative">
          {user?.profileImage?.url ? (
            <motion.img
              src={user.profileImage.url}
              alt={user.username}
              className="w-14 h-14 rounded-full object-cover border-2 border-muted shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 2 }}
              onClick={() => onUserClick?.(user._id)}
            />
          ) : (
            <motion.div
              className="w-14 h-14 rounded-full bg-type-1 flex items-center justify-center text-2xl font-bold text-type-2 border-2 border-muted shadow-2xl font-mono"
              whileHover={{ scale: 1.1, rotate: 2 }}
              onClick={() => onUserClick?.(user._id)}
            >
              {user?.username?.[0]?.toUpperCase() || "?"}
            </motion.div>
          )}
          
          {(user?.isPro || user?.isPremium) && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-yellow-600 to-amber-400 text-black text-[8px] font-black px-1.5 py-0.5 rounded-md border border-yellow-300 shadow-lg z-10">
              PRO
            </div>
          )}
        </div>

        <span 
          className="text-sm font-mono text-type-1 truncate underline-animation font-bold drop-shadow-md" 
          onClick={() => onUserClick?.(user._id)}
        >
          {user?.username}
        </span>
      </div>
    </div>
  );
};

const CategoryInfo = ({ 
  category, 
  totalNotesCount, 
  isOwner, 
  onDeleteClick, 
  onEditClick, 
  isPro, 
  onDownloadZip,
  isAuthenticated
}) => (
  <div className="flex flex-col font-mono items-center gap-2 w-full">
    <p className="text-lg text-type-3 font-mono text-center border-b border-muted px-4 py-2 mb-2 w-full max-w-md break-all">
      <span className="text-type-1 font-semibold">Category :</span> {category.name}
    </p>

    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex gap-2">
        <span className="text-md font-semibold font-mono">Type :</span>
        <span className="text-md text-type-3">
          {category.type || <span className="italic opacity-50">(none)</span>}
        </span>
      </div>

      <div className="flex gap-2 text-type-2 text-sm py-1 mt-1">
        <span className="font-semibold text-type-1 border border-muted px-3 py-1 rounded-md bg-white/5 shadow-inner">
          {totalNotesCount} Notes
        </span>
      </div>

      {isOwner && (
        <div className="flex gap-4 mt-3">
          <button
            className="p-2 rounded-full text-type-3 hover:text-white hover:bg-red-500/80 cursor-pointer border border-muted hover:scale-110 transition-all duration-200 shadow-lg"
            onClick={onDeleteClick}
            title="Delete this category"
          >
            <TrashIcon />
          </button>
          <button
            className="text-type-1 text-sm px-5 py-1.5 rounded-lg font-mono shadow-lg border border-muted cursor-pointer hover:bg-white/10 hover:-translate-y-1 transition-all duration-200"
            onClick={onEditClick}
          >
            Edit
          </button>
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-4">
          <div
            className={`text-type-1 text-xs px-4 py-2 rounded-lg font-mono shadow-xl border border-muted cursor-pointer hover:bg-white/10 hover:-translate-y-1 transition-all duration-200 w-fit flex items-center gap-2 ${!isPro ? "opacity-60 grayscale" : "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/40"}`}
            onClick={onDownloadZip}
            title={isPro ? "Download all notes as ZIP" : "Pro Feature: ZIP Download"}
          >
            {isPro ? "🚀 ZIP Archive" : "🔒 ZIP Archive (Pro)"}
          </div>
        </div>
      )}
    </div>
  </div>
);

const EditCategoryForm = ({ 
  editName, 
  editType, 
  onEditNameChange, 
  onEditTypeChange, 
  onEditSave, 
  onEditCancel 
}) => (
  <div className="flex flex-col items-center gap-4 w-full max-w-md bg-white/5 p-6 rounded-2xl border border-muted shadow-inner">
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-mono text-type-1 opacity-70">Category Name</label>
      <input
        type="text"
        className="w-full bg-type-2 border border-muted px-4 py-2.5 text-lg rounded-xl focus:ring-2 focus:ring-type-1/20 transition-all outline-none"
        value={editName}
        onChange={onEditNameChange}
        placeholder="Enter category name..."
      />
    </div>
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-mono text-type-1 opacity-70">Type (Singular Word)</label>
      <input
        type="text"
        className="w-full bg-type-2 border border-muted px-4 py-2.5 text-lg rounded-xl focus:ring-2 focus:ring-type-1/20 transition-all outline-none"
        value={editType}
        onChange={onEditTypeChange}
        placeholder="e.g. Work, Personal..."
      />
    </div>
    <div className="flex gap-4 mt-2">
      <button
        className="text-white bg-green-600/20 hover:bg-green-600/40 px-6 py-2 rounded-xl border border-green-500/30 font-mono shadow-md transition-all active:scale-95"
        onClick={onEditSave}
      >
        Save
      </button>
      <button
        className="text-type-1 bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl border border-muted font-mono shadow-md transition-all active:scale-95"
        onClick={onEditCancel}
      >
        Cancel
      </button>
    </div>
  </div>
);

const CategoryActions = ({ 
  onCreateNote, 
  onBulkTagClick, 
  onBulkDeleteClick, 
  selectedNotesCount, 
  isPro, 
  handleProAction 
}) => (
  <div className="flex flex-wrap items-center justify-center gap-4 mt-8 p-5 border border-dashed border-muted rounded-2xl bg-white/5 shadow-inner w-full max-w-2xl">
    <DottedButton text="Add Note" onClick={onCreateNote} className="!py-2.5 !px-6" />
    
    <DottedButton
      text={
        isPro 
          ? (selectedNotesCount > 0 ? `Bulk Tag (${selectedNotesCount})` : "Bulk Tag Mode")
          : `🔒 Bulk Tag (Pro)`
      }
      onClick={() => handleProAction(onBulkTagClick)}
      className={`!py-2.5 !px-6 transition-all ${selectedNotesCount > 0 ? "!bg-type-1/10 !border-type-1/40 !text-white" : ""} ${!isPro ? "opacity-60 scale-95" : "hover:scale-105"}`}
    />

    <DottedButton
      text={selectedNotesCount > 0 ? `Delete Notes (${selectedNotesCount})` : "Bulk Delete Mode"}
      onClick={onBulkDeleteClick}
      className={`!py-2.5 !px-6 transition-all ${selectedNotesCount > 0 ? "!bg-red-500/10 !border-red-500/40 !text-red-400" : "hover:scale-105"}`}
    />
  </div>
);

// --- Main Component ---

const CategoryHeader = ({
  category,
  user,
  isOwner,
  totalNotesCount,
  editMode,
  editName,
  editType,
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

  const handleDownloadZip = () => {
    handleProAction(async () => {
      try {
        window.location.href = `${axiosInstance.defaults.baseURL}/api/notes/category/${category._id}/download`;
      } catch (err) {
        toast.error("Failed to start download.");
      }
    });
  };

  return (
    <header
      className="w-full mx-auto p-6 shadow-2xl border border-muted mb-4 relative rounded-t-2xl glass-panel overflow-hidden"
      {...dragHandlers}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm" />

      <UserProfile 
        user={user} 
        onUserClick={onUserClick} 
        isAuthenticated={isAuthenticated} 
      />

      <div className="flex flex-col items-center mt-4">
        {editMode ? (
          <EditCategoryForm 
            editName={editName}
            editType={editType}
            onEditNameChange={onEditNameChange}
            onEditTypeChange={onEditTypeChange}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
          />
        ) : (
          <CategoryInfo 
            category={category}
            totalNotesCount={totalNotesCount}
            isOwner={isOwner}
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
            isPro={isPro}
            onDownloadZip={handleDownloadZip}
            isAuthenticated={isAuthenticated}
          />
        )}

        {isOwner && (
          <CategoryActions 
            onCreateNote={onCreateNote}
            onBulkTagClick={onBulkTagClick}
            onBulkDeleteClick={onBulkDeleteClick}
            selectedNotesCount={selectedNotesCount}
            isPro={isPro}
            handleProAction={handleProAction}
          />
        )}
      </div>
    </header>
  );
};

export default CategoryHeader;

import React from "react";
import { motion } from "framer-motion";
import { DottedButton } from "@/components/ui/buttons";

const ProfileHeader = ({
  profile,
  profileImageSrc,
  isOwnProfile,
  editMode,
  handleProfileImageClick,
  fileInputRef,
  handleProfileImageChange,
  handleCreateNote,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 mb-8 p-6 rounded-2xl border border-muted glass-panel shadow-xl">
      <div
        className={`relative ${isOwnProfile && editMode ? "cursor-pointer" : ""}`}
        onClick={isOwnProfile && editMode ? handleProfileImageClick : undefined}
      >
        {profileImageSrc ? (
          <motion.img
            src={profileImageSrc}
            alt={profile.username}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-muted shadow-2xl"
            style={{ opacity: editMode ? 0.6 : 1 }}
            whileHover={isOwnProfile ? { scale: 1.08 } : undefined}
          />
        ) : (
          <motion.div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-type-1 flex items-center justify-center text-4xl font-bold text-type-2 border border-muted shadow-2xl font-mono"
          >
            {profile.username?.[0]?.toUpperCase() || "?"}
          </motion.div>
        )}


        {isOwnProfile && editMode && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleProfileImageChange}
            />
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[10px] bg-type-3 text-type-1 border border-muted shadow">
              Change
            </span>
          </>
        )}
      </div>

      <div className="flex-1 w-full text-center sm:text-left">
        <h3 className="text-3xl font-extrabold text-type-1 font-mono break-all">
          {profile.username}
        </h3>

        {isOwnProfile && (
          <div className="mt-5 flex justify-center sm:justify-start">
            <DottedButton text="Create a new Note" onClick={handleCreateNote} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;

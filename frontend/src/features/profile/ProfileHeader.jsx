import React from "react";
import { motion } from "framer-motion";
import { DottedButton } from "@/components/ui/buttons";


const ProfileHeader = ({
  profile,
  profileImagePreview,
  editMode,
  handleProfileImageClick,
  fileInputRef,
  handleProfileImageChange,
  handleCreateNote,
}) => {
  return (
    <div
      className="
        w-full
        flex flex-col sm:flex-row
        items-center sm:items-start
        gap-6 sm:gap-10
        mb-8 md:mb-10
        p-6 sm:p-8
        rounded-2xl
        border border-muted
        glass-panel
        shadow-xl
      "
    >
      {/* ================= Profile Image ================= */}
      <div
        className="relative cursor-pointer"
        onClick={handleProfileImageClick}
      >
        {profileImagePreview ? (
          <motion.img
            src={profileImagePreview}
            alt={profile.username}
            className="
              w-28 h-28 sm:w-32 sm:h-32
              rounded-full object-cover
              border-2 border-muted
              shadow-2xl
            "
            style={{ opacity: editMode ? 0.6 : 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          />
        ) : (
          <motion.div
            className="
              w-28 h-28 sm:w-32 sm:h-32
              rounded-full
              bg-type-1
              flex items-center justify-center
              text-4xl sm:text-5xl
              font-bold
              text-type-2
              border border-muted
              shadow-2xl
              font-mono
            "
            style={{ opacity: editMode ? 0.6 : 1 }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            {profile.username?.[0]?.toUpperCase() || "?"}
          </motion.div>
        )}

        {/* Badge */}
        <span
          className="
            absolute -bottom-2 -right-2
            px-3 py-1
            rounded-full
            text-[10px] font-semibold
            bg-type-2 text-type-1
            border border-muted
            shadow-lg
            tracking-wide
          "
        >
          YOU
        </span>

        {/* Change hint */}
        {editMode && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleProfileImageChange}
            />
            <span
              className="
                absolute bottom-1 left-1/2 -translate-x-1/2
                px-2 py-1
                rounded-md
                text-[10px]
                bg-type-3 text-type-1
                border border-muted
                shadow
                backdrop-blur
              "
            >
              Change
            </span>
          </>
        )}
      </div>

      {/* ================= Info ================= */}
      <div className="flex-1 w-full text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h3
            className="
              text-2xl sm:text-3xl md:text-4xl
              font-extrabold
              text-type-1
              font-mono
              break-all
            "
          >
            {profile.username}
          </h3>

          <span
            className={`
              px-2 py-1 rounded-full
              text-[10px] font-semibold
              tracking-wide
              border
              ${profile.isVerified
                ? "bg-green-500/10 text-green-400 border-green-400/40"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-400/40"}
            `}
          >
            {profile.isVerified ? "VERIFIED" : "UNVERIFIED"}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-center sm:justify-start">
          <DottedButton
          text="Create a new Note"
            onClick={handleCreateNote}

          />

        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

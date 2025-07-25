import React from "react";

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
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8 md:mb-10">
      <div
        className="relative cursor-pointer mb-4 sm:mb-0"
        onClick={handleProfileImageClick}
      >
        {profileImagePreview ? (
          <img
            src={profileImagePreview}
            alt={profile.username}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
            style={{ opacity: editMode ? 0.7 : 1 }}
          />
        ) : (
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-indigo-100 flex items-center justify-center text-4xl sm:text-5xl text-indigo-400 font-bold border-4 border-indigo-200 shadow-lg"
            style={{ opacity: editMode ? 0.7 : 1 }}
          >
            {profile.username?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <span className="absolute -bottom-2 -right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md border-2 border-white animate-pulse">
          You
        </span>
        {editMode && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleProfileImageChange}
            />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-indigo-700 text-white px-2 py-1 rounded text-xs shadow-md border border-white">
              Change
            </span>
          </>
        )}
      </div>
      <div className="w-full flex-1 justify-center">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2 flex-wrap text-center justify-center" style={{ wordBreak: "break-all" }}>
          {profile.username}
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${profile.isVerified
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
              }`}
          >
            {profile.isVerified ? "Verified" : "Unverified"}
          </span>
        </h3>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <div
            type="button"
            onClick={handleCreateNote}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-none border border-dashed border-black shadow transition cursor-pointer"
            style={{ background: "white" }}
          >
            <span className="font-semibold text-indigo-700 text-base">
              Create a new Note
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 
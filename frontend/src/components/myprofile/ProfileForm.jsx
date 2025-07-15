import React from "react";

const ProfileForm = ({
  editMode,
  editProfile,
  handleInputChange,
  profile,
  getWebsiteHref,
  handleSave,
  handleCancel,
  updateLoading,
  updateError,
  updateSuccess,
  onEdit,
  EncryptButton,
}) => (
  <form onSubmit={handleSave}>
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <label className="block text-sm font-semibold text-gray-700 mb-1 text-center text-nowrap min-w-[60px]">
          Bio :
        </label>
        {editMode ? (
          <textarea
            name="bio"
            value={editProfile.bio}
            onChange={handleInputChange}
            className="w-full h-15 border text-black border-indigo-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            rows={3}
            maxLength={200}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          />
        ) : (
          <div className="text-xs rounded-xl px-3 py-2 shadow-xl border border-indigo-50 w-full sm:w-fit">
            <p className="text-black" style={{ wordBreak: "break-all" }}>
              {profile.bio ? (
                `"${profile.bio}"`
              ) : (
                <span className="italic text-gray-400">No bio</span>
              )}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <label className="block text-sm font-semibold text-gray-700 mb-1 text-nowrap min-w-[60px]">
          Website :
        </label>
        {editMode ? (
          <input
            type="text"
            name="website"
            value={editProfile.website}
            onChange={handleInputChange}
            className="w-full border border-indigo-200 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            maxLength={128}
            placeholder="e.g. example.com or https://example.com"
            autoComplete="off"
          />
        ) : (
          <div className="text-xs rounded-xl px-3 py-2 shadow-xl border border-indigo-50 w-full sm:w-fit">
            {profile.website ? (
              <a
                href={getWebsiteHref(profile.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black break-all"
                style={{ wordBreak: "break-all" }}
              >
                {profile.website}
              </a>
            ) : (
              <span className="italic text-gray-400">No website</span>
            )}
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      {!editMode ? (
        <div onClick={onEdit}>
          <EncryptButton />
        </div>
      ) : (
        <>
          <button
            type="submit"
            className="text-black px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-400/20 transition border border-dashed border-black"
            disabled={updateLoading}
          >
            {updateLoading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="text-black px-6 py-2 rounded-lg font-semibold shadow hover:bg-red-400/20 transition"
            style={{ borderColor: "black", borderWidth: "1px", borderStyle: "dashed" }}
            onClick={handleCancel}
            disabled={updateLoading}
          >
            Cancel
          </button>
        </>
      )}
    </div>
    {updateError && <div className="mt-4 text-red-500">{updateError}</div>}
    {updateSuccess && <div className="mt-4 text-green-600">{updateSuccess}</div>}
  </form>
);

export default ProfileForm; 
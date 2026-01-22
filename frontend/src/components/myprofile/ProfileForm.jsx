import React from "react";
import ButtonType3 from "../buttons/ButtonType3";

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
}) => (
  <form
    onSubmit={handleSave}
    className="
      w-full
      mt-6
      p-6 sm:p-8
      rounded-2xl
      border border-muted
      glass-panel
      shadow-xl
      flex flex-row justify-between item-center gap-6
      font-mono
    "
  >
    {/* ================= Fields ================= */}
    <div className="flex flex-col gap-4">
      {/* Bio */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="text-sm font-semibold text-type-1 min-w-[70px]">
          Bio
        </label>

        {editMode ? (
          <textarea
            name="bio"
            value={editProfile.bio}
            onChange={handleInputChange}
            rows={3}
            maxLength={200}
            className="
              w-full
              rounded-xl
              border border-muted
              px-3 py-2
              text-type-1
              bg-transparent
              focus:outline-none
              focus:ring-1 focus:ring-white/40
            "
            placeholder="Write something about yourself…"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          />
        ) : (
          <div
            className="
              w-full sm:w-fit
              px-4 py-2
              rounded-xl
              border border-muted
              bg-white/5
              shadow
            "
          >
            <p className="text-sm text-type-1 break-all">
              {profile.bio ? (
                `"${profile.bio}"`
              ) : (
                <span className="italic text-type-3">No bio</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Website */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="text-sm font-semibold text-type-1 min-w-[70px]">
          Website
        </label>

        {editMode ? (
          <input
            type="text"
            name="website"
            value={editProfile.website}
            onChange={handleInputChange}
            maxLength={128}
            placeholder="example.com or https://example.com"
            autoComplete="off"
            className="
              w-full
              rounded-xl
              border border-muted
              px-3 py-2
              text-type-1
              bg-transparent
              focus:outline-none
              focus:ring-1 focus:ring-white/40
            "
          />
        ) : (
          <div
            className="
              w-full sm:w-fit
              px-4 py-2
              rounded-xl
              border border-muted
              bg-white/5
              shadow
            "
          >
            {profile.website ? (
              <a
                href={getWebsiteHref(profile.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-type-1 underline-animation break-all"
              >
                {profile.website}
              </a>
            ) : (
              <span className="italic text-type-3 text-sm">
                No website
              </span>
            )}
          </div>
        )}
      </div>
    </div>

    {/* ================= Actions ================= */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center my-auto">
      {!editMode ? (
        <div className="w-fit">
          <ButtonType3
            text="Edit"
            onClick={onEdit}
          />
        </div>
      ) : (
        <>
          <ButtonType3
            text={updateLoading ? "Saving..." : "Save"}
            onClick={handleSave}
            disabled={updateLoading}
            type="submit"
          />

          <ButtonType3
            text="Cancel"
            onClick={handleCancel}
            disabled={updateLoading}
          />
        </>
      )}
    </div>

    {/* ================= Status ================= */}
    {updateError && (
      <div className="text-sm text-red-400 text-center">
        {updateError}
      </div>
    )}

    {updateSuccess && (
      <div className="text-sm text-green-400 text-center">
        {updateSuccess}
      </div>
    )}
  </form>
);

export default ProfileForm;

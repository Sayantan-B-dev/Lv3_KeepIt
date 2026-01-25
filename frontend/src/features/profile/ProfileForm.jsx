import React from "react";
import { ButtonType3 } from "@/components/ui/buttons";

const ProfileForm = ({
  editMode,
  editProfile,
  handleInputChange,
  profile,
  handleSave,
  handleCancel,
  updateLoading,
  updateError,
  updateSuccess,
}) => {
  if (!editMode) return null;

  return (
    <>
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
          flex flex-col
          gap-6
          font-mono
        "
      >
        <h4 className="text-xl font-bold text-type-1">Edit Profile Details</h4>

        {/* ================= FIELDS ================= */}
        <div className="flex flex-col gap-6">
          {/* Bio */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-type-3">
              Bio
            </label>
            <textarea
              name="bio"
              value={editProfile.bio || ""}
              onChange={handleInputChange}
              rows={3}
              maxLength={200}
              className="
                w-full
                rounded-xl
                border border-muted
                px-4 py-3
                text-type-1
                bg-white/5
                focus:outline-none
                focus:ring-2 focus:ring-white/10
                transition-all
              "
              placeholder="Write something about yourself…"
            />
          </div>

          {/* Website */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-type-3">
              Website
            </label>
            <input
              type="text"
              name="website"
              value={editProfile.website || ""}
              onChange={handleInputChange}
              maxLength={128}
              placeholder="example.com"
              autoComplete="off"
              className="
                w-full
                rounded-xl
                border border-muted
                px-4 py-3
                text-type-1
                bg-white/5
                focus:outline-none
                focus:ring-2 focus:ring-white/10
                transition-all
              "
            />
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex flex-row gap-4 justify-end items-center mt-4">
          <ButtonType3
            text="Cancel"
            onClick={handleCancel}
            disabled={updateLoading}
            type="button"
          />
          <button
            type="submit"
            disabled={updateLoading}
            className="px-8 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-type-1 font-bold border border-white/20 transition-all disabled:opacity-50"
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* ================= STATUS ================= */}
      {updateError && (
        <div className="mt-3 text-sm text-red-400 text-center">
          {updateError}
        </div>
      )}

      {updateSuccess && (
        <div className="mt-3 text-sm text-green-400 text-center">
          {updateSuccess}
        </div>
      )}
    </>
  );
};

export default ProfileForm;

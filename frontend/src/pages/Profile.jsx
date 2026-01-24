import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";

import { Loading } from "@/features/home";
import { ConfirmPopUp } from "@/components/ui";
import ProfileHeader from "@/features/profile/ProfileHeader";
import ProfileForm from "@/features/profile/ProfileForm";
import CategoryList from "@/features/profile/CategoryList";
import DeleteAccountSection from "@/features/profile/DeleteAccountSection";

import { handleProfileImage } from "@/utils/handleProfileImage";

const PAGE_LIMIT = 10;

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading, error: authError } = useAuth();

  const isOwnProfile = !userId || userId === user?._id;

  /* ================= CORE ================= */

  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= EDIT ================= */

  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  /* ================= IMAGE ================= */

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  /* ================= DELETE ================= */

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  /* ================= NOTES ================= */

  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState({});
  const [notesLoading, setNotesLoading] = useState({});
  const [notesError, setNotesError] = useState({});
  const [categoryPage, setCategoryPage] = useState({});
  const [categoryHasMore, setCategoryHasMore] = useState({});

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const endpoint = isOwnProfile
          ? "/api/profile/MyProfile"
          : `/api/profile/${userId}`;

        const res = await axiosInstance.get(endpoint);

        setProfile(res.data);
        setCategories(res.data.categories || []);

        if (isOwnProfile) {
          setEditProfile({
            bio: res.data.bio || "",
            website: res.data.website || "",
          });
          setProfileImagePreview(res.data.profileImage?.url || null);
          setProfileImageFile(null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isOwnProfile]);

  /* ================= IMAGE CHANGE (FIXED) ================= */

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleProfileImage(file, ({ profileImage, profileImagePreview }) => {
      setProfileImageFile(profileImage);
      setProfileImagePreview(profileImagePreview);
    });
  };

  /* ================= CATEGORY ================= */

  const handleCategoryDropdown = async (catId) => {
    if (openCategoryId === catId) {
      setOpenCategoryId(null);
      return;
    }

    setOpenCategoryId(catId);
    if (categoryNotes[catId]) return;

    setNotesLoading(p => ({ ...p, [catId]: true }));
    setNotesError(p => ({ ...p, [catId]: null }));

    try {
      const endpoint = isOwnProfile
        ? `/api/notes/category/${catId}?page=1&limit=${PAGE_LIMIT}`
        : `/api/notes/category/${catId}/public?page=1&limit=${PAGE_LIMIT}`;

      const res = await axiosInstance.get(endpoint);

      setCategoryNotes(p => ({ ...p, [catId]: res.data.notes || [] }));
      setCategoryPage(p => ({ ...p, [catId]: 1 }));
      setCategoryHasMore(p => ({ ...p, [catId]: res.data.hasMore }));
    } catch {
      setNotesError(p => ({ ...p, [catId]: "Failed to load notes" }));
    } finally {
      setNotesLoading(p => ({ ...p, [catId]: false }));
    }
  };

  const handleLoadMore = async (catId) => {
    const nextPage = (categoryPage[catId] || 1) + 1;
    setNotesLoading(p => ({ ...p, [catId]: true }));

    try {
      const endpoint = isOwnProfile
        ? `/api/notes/category/${catId}?page=${nextPage}&limit=${PAGE_LIMIT}`
        : `/api/notes/category/${catId}/public?page=${nextPage}&limit=${PAGE_LIMIT}`;

      const res = await axiosInstance.get(endpoint);

      setCategoryNotes(p => ({
        ...p,
        [catId]: [...(p[catId] || []), ...(res.data.notes || [])],
      }));

      setCategoryPage(p => ({ ...p, [catId]: nextPage }));
      setCategoryHasMore(p => ({ ...p, [catId]: res.data.hasMore }));
    } catch {
      setNotesError(p => ({ ...p, [catId]: "Failed to load more notes" }));
    } finally {
      setNotesLoading(p => ({ ...p, [catId]: false }));
    }
  };

  /* ================= SAVE ================= */

  const handleSave = async (e) => {
    e.preventDefault();

    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const formData = new FormData();
      formData.append("bio", editProfile.bio || "");
      formData.append("website", editProfile.website || "");

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const res = await axiosInstance.put("/api/profile/MyProfile", formData);

      setProfile(res.data);
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setEditMode(false);
      setUpdateSuccess("Profile updated");
    } catch {
      setUpdateError("Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleConfirmDeleteAccount = async () => {
    if (deleteStep < 3) {
      setDeleteStep(p => p + 1);
      return;
    }

    setDeleteLoading(true);
    try {
      await axiosInstance.delete("/api/profile/MyProfile");
      window.location.replace("/login");
    } catch {
      setDeleteError("Failed to delete account.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setDeleteStep(1);
    }
  };

  /* ================= GUARDS ================= */

  if (authLoading || loading) return <Loading />;
  if (authError) return <div className="text-red-500">{authError}</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>User not found.</div>;

  const profileImageSrc =
    editMode && profileImagePreview
      ? profileImagePreview
      : profile.profileImage?.url || null;

  /* ================= RENDER ================= */

  return (
    <>
      {isOwnProfile && (
        <ConfirmPopUp
          open={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setDeleteStep(1);
          }}
          onConfirm={handleConfirmDeleteAccount}
          loading={deleteLoading}
          message={
            deleteStep === 1
              ? "Are you sure you want to delete your account?"
              : deleteStep === 2
              ? "This will permanently delete ALL your categories and notes."
              : "FINAL WARNING: ALL data will be erased permanently."
          }
        />
      )}

      <div className="mx-auto p-6 w-full border border-muted glass-panel rounded-lg shadow-xl mb-8">
        <ProfileHeader
          profile={profile}
          profileImageSrc={profileImageSrc}
          isOwnProfile={isOwnProfile}
          editMode={editMode}
          handleProfileImageClick={() =>
            isOwnProfile && editMode && fileInputRef.current?.click()
          }
          fileInputRef={fileInputRef}
          handleProfileImageChange={handleProfileImageChange}
          handleCreateNote={() => navigate("/CreateNote")}
        />

        {isOwnProfile && (
          <ProfileForm
            editMode={editMode}
            editProfile={editProfile}
            handleInputChange={(e) =>
              setEditProfile(p => ({ ...p, [e.target.name]: e.target.value }))
            }
            profile={profile}
            handleSave={handleSave}
            handleCancel={() => {
              setEditProfile({
                bio: profile.bio || "",
                website: profile.website || "",
              });
              setEditMode(false);
              setProfileImagePreview(profile.profileImage?.url || null);
              setProfileImageFile(null);
            }}
            updateLoading={updateLoading}
            updateError={updateError}
            updateSuccess={updateSuccess}
            onEdit={() => {
              setUpdateError(null);
              setUpdateSuccess(null);
              setEditMode(true);
            }}
          />
        )}

        <CategoryList
        isOwnProfile={isOwnProfile}
          categories={categories}
          openCategoryId={openCategoryId}
          handleCategoryDropdown={handleCategoryDropdown}
          notesLoading={notesLoading}
          notesError={notesError}
          navigate={navigate}
          categoryNotes={categoryNotes}
          categoryHasMore={categoryHasMore}
          handleLoadMore={handleLoadMore}
          handleNoteClick={(note) => navigate(`/note/${note._id}`)}
          handleCategoryClick={(catId) => navigate(`/category/${catId}`)}
          readOnly={!isOwnProfile}
        />

        {isOwnProfile && (
          <DeleteAccountSection
            deleteLoading={deleteLoading}
            setShowDeleteConfirm={(v) => {
              setDeleteStep(1);
              setShowDeleteConfirm(v);
            }}
            deleteError={deleteError}
            deleteSuccess={deleteSuccess}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
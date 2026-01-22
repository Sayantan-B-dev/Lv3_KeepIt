import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/home/Loading";
import ConfirmPopUp from "../components/ConfirmPopUp";

/* shared components */
import ProfileHeader from "../components/myprofile/ProfileHeader";
import ProfileForm from "../components/myprofile/ProfileForm";
import CategoryList from "../components/myprofile/CategoryList";
import DeleteAccountSection from "../components/myprofile/DeleteAccountSection";

/* public-only */
import NoteModal from "../components/myprofile/NoteModal";

import { marked } from "marked";
import DOMPurify from "dompurify";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading, error: authError } = useAuth();

  /* ================= Context ================= */

  const isOwnProfile = !userId || userId === user?._id;

  /* ================= Core state ================= */

  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= Edit profile ================= */

  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const fileInputRef = useRef(null);

  /* ================= Delete account ================= */

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  /* ================= Categories / notes ================= */

  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState({});
  const [notesLoading, setNotesLoading] = useState({});
  const [notesError, setNotesError] = useState({});

  const [categoryPage, setCategoryPage] = useState({});
  const [categoryHasMore, setCategoryHasMore] = useState({});

  /* ================= Public note modal ================= */

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [openNote, setOpenNote] = useState(null);
  const [noteModalLoading, setNoteModalLoading] = useState(false);
  const [noteModalError, setNoteModalError] = useState(null);

  /* ================= Fetch profile ================= */

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
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isOwnProfile]);

  /* ================= Category dropdown ================= */

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
      const url = isOwnProfile
        ? `/api/notes/category/${catId}?page=1&limit=20`
        : `/api/categories/${catId}`;

      const res = await axiosInstance.get(url);

      const notes = isOwnProfile
        ? res.data.notes
        : (res.data.notes || []).slice().sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          );

      setCategoryNotes(p => ({ ...p, [catId]: notes }));

      if (isOwnProfile) {
        setCategoryPage(p => ({ ...p, [catId]: 1 }));
        setCategoryHasMore(p => ({ ...p, [catId]: res.data.hasMore }));
      }
    } catch {
      setNotesError(p => ({ ...p, [catId]: "Failed to load notes" }));
    } finally {
      setNotesLoading(p => ({ ...p, [catId]: false }));
    }
  };

  /* ================= Load more (own profile only) ================= */

  const handleLoadMore = async (catId) => {
    const nextPage = (categoryPage[catId] || 1) + 1;

    setNotesLoading(p => ({ ...p, [catId]: true }));

    try {
      const res = await axiosInstance.get(
        `/api/notes/category/${catId}?page=${nextPage}&limit=20`
      );

      setCategoryNotes(p => ({
        ...p,
        [catId]: [...(p[catId] || []), ...res.data.notes],
      }));

      setCategoryPage(p => ({ ...p, [catId]: nextPage }));
      setCategoryHasMore(p => ({ ...p, [catId]: res.data.hasMore }));
    } catch {
      setNotesError(p => ({ ...p, [catId]: "Failed to load more notes" }));
    } finally {
      setNotesLoading(p => ({ ...p, [catId]: false }));
    }
  };

  /* ================= Note click ================= */

  const handleNoteClick = async (note) => {
    if (isOwnProfile) {
      navigate(`/note/${note._id}`);
      return;
    }

    setNoteModalOpen(true);
    setNoteModalLoading(true);
    setNoteModalError(null);

    try {
      if (note.content) {
        setOpenNote(note);
      } else {
        const res = await axiosInstance.get(`/api/notes/${note._id}`);
        setOpenNote(res.data);
      }
    } catch (err) {
      setNoteModalError("Failed to load note.");
    } finally {
      setNoteModalLoading(false);
    }
  };

  /* ================= Guards ================= */

  if (authLoading || loading) return <Loading />;
  if (authError) return <div className="text-red-500">{authError}</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div>User not found.</div>;

  const getWebsiteHref = (website) =>
    /^https?:\/\//i.test(website) ? website : `//${website}`;

  /* ================= Render ================= */

  return (
    <>
      {isOwnProfile && (
        <ConfirmPopUp
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={async () => {
            setDeleteLoading(true);
            try {
              await axiosInstance.delete("/api/profile/MyProfile");
              setDeleteSuccess("Account deleted.");
              setTimeout(() => navigate("/login"), 1500);
            } catch {
              setDeleteError("Failed to delete account.");
            } finally {
              setDeleteLoading(false);
            }
          }}
          loading={deleteLoading}
          message="Are you sure you want to delete your account?"
        />
      )}

      <div className="mx-auto p-6 w-full border border-muted glass-panel rounded-lg shadow-xl mb-8">
        <ProfileHeader
          profile={profile}
          editable={isOwnProfile}
          profileImagePreview={profileImagePreview}
          editMode={editMode}
          handleProfileImageClick={() =>
            editMode && fileInputRef.current?.click()
          }
          fileInputRef={fileInputRef}
          handleProfileImageChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
          }}
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
            getWebsiteHref={getWebsiteHref}
            handleSave={async (e) => {
              e.preventDefault();
              setUpdateLoading(true);
              try {
                await axiosInstance.put("/api/profile/MyProfile", editProfile);
                setEditMode(false);
                setUpdateSuccess("Profile updated");
              } catch {
                setUpdateError("Failed to update profile");
              } finally {
                setUpdateLoading(false);
              }
            }}
            handleCancel={() => setEditMode(false)}
            updateLoading={updateLoading}
            updateError={updateError}
            updateSuccess={updateSuccess}
            onEdit={() => setEditMode(true)}
          />
        )}

        <CategoryList
          categories={categories}
          openCategoryId={openCategoryId}
          handleCategoryDropdown={handleCategoryDropdown}
          notesLoading={notesLoading}
          notesError={notesError}
          categoryNotes={categoryNotes}
          categoryHasMore={isOwnProfile ? categoryHasMore : {}}
          handleLoadMore={isOwnProfile ? handleLoadMore : null}
          handleNoteClick={handleNoteClick}
          navigate={navigate}
          readOnly={!isOwnProfile}
        />

        {isOwnProfile && (
          <DeleteAccountSection
            deleteLoading={deleteLoading}
            setShowDeleteConfirm={setShowDeleteConfirm}
            deleteError={deleteError}
            deleteSuccess={deleteSuccess}
          />
        )}
      </div>

      {!isOwnProfile && (
        <NoteModal
          noteModalOpen={noteModalOpen}
          openNote={openNote}
          closeNoteModal={() => {
            setNoteModalOpen(false);
            setOpenNote(null);
          }}
          noteModalLoading={noteModalLoading}
          noteModalError={noteModalError}
          noteContentHtml={
            openNote?.content
              ? DOMPurify.sanitize(marked(openNote.content))
              : ""
          }
        />
      )}
    </>
  );
};

export default Profile;

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import EncryptButton from "../components/buttons/EncryptButton";
import Magnet from "../components/advance/Magnet";
import { useAuth } from "../context/AuthContext";
import ConfirmPopUp from "../components/ConfirmPopUp";
import { marked } from "marked";
import DOMPurify from "dompurify";
import ProfileHeader from "../components/myprofile/ProfileHeader";
import ProfileForm from "../components/myprofile/ProfileForm";
import CategoryList from "../components/myprofile/CategoryList";
import DeleteAccountSection from "../components/myprofile/DeleteAccountSection";
import NoteModal from "../components/myprofile/NoteModal";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user: loggedInUser, loading: appLoading, error: appError } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // For delete user
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Editable fields
  const [editProfile, setEditProfile] = useState({});
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Add at the top of the component
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState({}); // { [catId]: [notes] }
  const [notesLoading, setNotesLoading] = useState({}); // { [catId]: bool }
  const [notesError, setNotesError] = useState({}); // { [catId]: string }
  const [openNote, setOpenNote] = useState(null); // note object
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  const handleCategoryClick = (categoryID) => {
    navigate(`/category/${categoryID}`);
  };

  // New: handle create note
  const handleCreateNote = () => {
    navigate("/CreateNote");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/profile/MyProfile`);
        setProfile(res.data);
        setCategories(res.data.categories || []);
        setEditProfile({
          username: res.data.username || "",
          email: res.data.email || "",
          bio: res.data.bio || "",
          location: res.data.location || "",
          website: res.data.website || "",
        });
        setProfileImagePreview(res.data.profileImage?.url || null);
        setProfileImageFile(null);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          "Failed to load profile. Please try again later."
        );
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileImageClick = () => {
    if (editMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image upload helper: always returns the image URL string
  const uploadToBackend = async (file) => {
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await axiosInstance.post(
        "/api/auth/upload-profile-image",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (!res.data?.url) {
        throw new Error(
          res.data?.message || "Failed to upload image to backend"
        );
      }
      return { url: res.data.url, filename: res.data.url };
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload image to backend"
      );
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setUpdateError("Only JPEG, JPG, and PNG images are allowed.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setUpdateError("Image size must be less than 3MB.");
      return;
    }
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setEditMode(true);
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setUpdateError(null);
    setUpdateSuccess(null);
    // Reset edits
    setEditProfile({
      username: profile.username || "",
      email: profile.email || "",
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
    });
    setProfileImagePreview(profile?.profileImage?.url || null);
    setProfileImageFile(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    let profileImageToSave = profile?.profileImage || null;
    if (profileImageFile) {
      try {
        profileImageToSave = await uploadToBackend(profileImageFile);
      } catch (imgErr) {
        setUpdateError(imgErr?.message || "Failed to upload profile image.");
        setUpdateLoading(false);
        return;
      }
    } else if (profileImagePreview === null) {
      profileImageToSave = null;
    }

    try {
      const res = await axiosInstance.put("/api/profile/MyProfile", {
        bio: editProfile.bio,
        website: editProfile.website,
        profileImage: profileImageToSave,
      });
      setProfile((prev) => ({
        ...prev,
        ...res.data,
      }));
      setEditMode(false);
      setUpdateSuccess("Profile updated successfully!");
      setProfileImageFile(null);
      setProfileImagePreview(res.data.profileImage?.url || null);
    } catch (err) {
      setUpdateError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile."
      );
      console.log(err);
    } finally {
      setUpdateLoading(false);
    }
    window.location.reload();
  };

  // --- Delete user logic ---
  const handleDeleteUser = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteSuccess(null);
    try {
      await axiosInstance.delete("/api/profile/MyProfile");
      setDeleteSuccess("Your account has been deleted.");
      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 1500);
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete account."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCategoryDropdown = async (catId) => {
    if (openCategoryId === catId) {
      setOpenCategoryId(null);
      return;
    }
    setOpenCategoryId(catId);
    if (!categoryNotes[catId]) {
      setNotesLoading((prev) => ({ ...prev, [catId]: true }));
      setNotesError((prev) => ({ ...prev, [catId]: null }));
      try {
        const res = await axiosInstance.get(`/api/categories/${catId}`);
        setCategoryNotes((prev) => ({ ...prev, [catId]: res.data.notes || [] }));
      } catch (err) {
        setNotesError((prev) => ({ ...prev, [catId]: err?.response?.data?.message || "Failed to load notes." }));
      } finally {
        setNotesLoading((prev) => ({ ...prev, [catId]: false }));
      }
    }
  };
  const handleNoteClick = (note) => {
    setOpenNote(note);
    setNoteModalOpen(true);
  };
  const closeNoteModal = () => {
    setNoteModalOpen(false);
    setOpenNote(null);
  };

  if (appLoading || loading) {
    return <div>Loading...</div>;
  }

  if (appError) {
    return <div className="text-red-500">{appError}</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div>User not found.</div>;
  }

  const getWebsiteHref = (website) => {
    if (!website) return "";
    if (/^https?:\/\//i.test(website)) {
      return website;
    }
    if (/^\/\//.test(website)) {
      return website;
    }
    return "//" + website;
  };

  return (
    <>
      <ConfirmPopUp
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteUser}
        loading={deleteLoading}
        message="Are you sure you want to delete your account? This will also delete all your notes and categories. This action cannot be undone."
      />

      
        <div
          className={`
          mx-auto
          p-4 sm:p-6 md:p-10
          w-[90%] max-w-full
          md:w-[90%] md:max-w-2xl
          lg:max-w-3xl
          bg-gradient-to-br from-white via-indigo-50 to-blue-50
          shadow-2xl border border-indigo-100
          mt-8 md:mt-10 mb-12 md:mb-16
          rounded-3xl md:rounded-[60px]
          transition-all
        `}
          style={{
            backdropFilter: "blur(2px)",
            backdropShadow: "20px",
            background: "rgba(255, 255, 255, 0.01)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 32px 0 rgba(31, 38, 135, 0.20)",
            borderRadius: "60px",
            border: "1px dashed black",
          }}
        >
          <ProfileHeader
            profile={profile}
            profileImagePreview={profileImagePreview}
            editMode={editMode}
            handleProfileImageClick={handleProfileImageClick}
            fileInputRef={fileInputRef}
            handleProfileImageChange={handleProfileImageChange}
            handleCreateNote={handleCreateNote}
          />

          <ProfileForm
            editMode={editMode}
            editProfile={editProfile}
            handleInputChange={handleInputChange}
            profile={profile}
            getWebsiteHref={getWebsiteHref}
            handleSave={handleSave}
            handleCancel={handleCancel}
            updateLoading={updateLoading}
            updateError={updateError}
            updateSuccess={updateSuccess}
            onEdit={handleEdit}
            EncryptButton={EncryptButton}
          />

          <CategoryList
            categories={categories}
            openCategoryId={openCategoryId}
            handleCategoryDropdown={handleCategoryDropdown}
            notesLoading={notesLoading}
            notesError={notesError}
            categoryNotes={categoryNotes}
            handleNoteClick={handleNoteClick}
            navigate={navigate}
            handleCategoryClick={handleCategoryClick}
          />

          <DeleteAccountSection
            deleteLoading={deleteLoading}
            setShowDeleteConfirm={setShowDeleteConfirm}
            deleteError={deleteError}
            deleteSuccess={deleteSuccess}
          />
        </div>
      <NoteModal
        noteModalOpen={noteModalOpen}
        openNote={openNote}
        closeNoteModal={closeNoteModal}
        noteContentHtml={openNote ?
          DOMPurify.sanitize(
                    marked(openNote.content || "", {
                      highlight: function (code, lang) {
                        return code;
                      }
                    })
                  )
                    .replace(
                      /<a /g,
                      '<a target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 500; word-break: break-all; overflow-wrap: anywhere;" '
                    )
                    .replace(
                      /<pre>/g,
                      '<pre style="background: #23272e; color: #f8f8f2; padding: 1em; border-radius: 10px; margin: 1em 0; overflow-x: auto; font-size: 0.97em;">'
                    )
                    .replace(
                      /<pre[^>]*>\s*<code( class=".*?")?>/g,
                      '<pre style="background: #23272e; color: #f8f8f2; padding: 1em; border-radius: 10px; margin: 1em 0; overflow-x: auto; font-size: 0.97em;"><code style="background: transparent; color: inherit; padding: 0; border-radius: 0; font-size: inherit;">'
                    )
                    .replace(
                      /<code( class=".*?")?>/g,
                      '<code style="background: #f3f4f6; color: #23272e; padding: 2px 6px; border-radius: 4px; font-size: 0.97em; border: 1px solid #e5e7eb;">'
                    )
                    .replace(
                      /<table>/g,
                      '<div style="overflow-x:auto; max-width:100vw;"><table style="min-width:400px; width:100%; border-collapse:collapse; margin:1.5em 0; font-size:0.98em; background:#f8fafc; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px 0 rgba(31,38,135,0.05);">'
                    )
                    .replace(
                      /<thead>/g,
                      '<thead style="background:#e0e7ef;">'
                    )
                    .replace(
                      /<th>/g,
                      '<th style="padding:10px 16px; border-bottom:2px solid #c7d2fe; font-weight:700; text-align:left; color:#1e293b;">'
                    )
                    .replace(
                      /<tr>/g,
                      '<tr style="border-bottom:1px solid #e5e7eb;">'
                    )
                    .replace(
                      /<td>/g,
                      '<td style="padding:10px 16px; border-bottom:1px solid #e5e7eb; color:#334155; vertical-align:top;">'
                    )
                    .replace(
                      /<\/table>/g,
                      '</table></div>'
            ) : ""}
              />
    </>
  );
};

export default MyProfile;
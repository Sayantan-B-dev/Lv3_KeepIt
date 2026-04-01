import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";

import { Loading } from "@/features/home";
import ProfileHeader from "@/features/profile/ProfileHeader";
import ProfileForm from "@/features/profile/ProfileForm";
import CategoryList from "@/features/profile/CategoryList";
import DeleteAccountSection from "@/features/profile/DeleteAccountSection";
import DeleteAccountModal from "@/features/profile/DeleteAccountModal";

import { handleProfileImage } from "@/utils/handleProfileImage";
import UserListModal from "@/features/profile/UserListModal";
import CategoryStatsModal from "@/features/profile/CategoryStatsModal";
import CreateCategoryModal from "@/features/profile/CreateCategoryModal";
import { toast } from "react-toastify";

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


  /* ================= NOTES ================= */

  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState({});
  const [notesLoading, setNotesLoading] = useState({});
  const [notesError, setNotesError] = useState({});
  const [categoryPage, setCategoryPage] = useState({});
  const [categoryHasMore, setCategoryHasMore] = useState({});

  /* ================= SOCIAL ================= */

  const [activeModal, setActiveModal] = useState(null); // 'followers', 'following', 'categories'
  const [socialLoading, setSocialLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  /* ================= SOCIAL ACTIONS ================= */

  const handleFollowToggle = async () => {
    if (!user) {
      toast.error("Please log in to follow users");
      return;
    }

    setSocialLoading(true);
    try {
      const isFollowing = profile.isFollowing;
      const endpoint = `/api/profile/${profile._id}/${isFollowing ? "unfollow" : "follow"}`;
      const res = await axiosInstance.post(endpoint);

      // Update local profile state
      setProfile(prev => ({
        ...prev,
        isFollowing: !isFollowing,
        followers: res.data.followers || prev.followers
      }));

      toast.success(isFollowing ? "Unfollowed" : "Followed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update follow status");
    } finally {
      setSocialLoading(false);
    }
  };

  /* ================= DELETE ================= */



  /* ================= GUARDS ================= */
  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loading />
      </div>
    );
  }

  if (authError || error) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="glass-panel border-muted p-8 rounded-2xl text-center max-w-md shadow-2xl">
          <div className="text-red-400 text-5xl mb-4 font-serif">!</div>
          <h2 className="text-white text-xl font-semibold mb-2">Error Occurred</h2>
          <p className="text-red-200/80 mb-6">{authError || error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all text-white"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="glass-panel border-muted p-12 rounded-2xl text-center shadow-xl">
          <div className="text-white/40 text-6xl mb-4">?</div>
          <h2 className="text-white text-xl font-medium">User not found.</h2>
          <p className="text-white/60 mt-2">The profile you are looking for might have been moved or deleted.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 text-white/80 hover:text-white underline underline-offset-4"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const profileImageSrc =
    editMode && profileImagePreview
      ? profileImagePreview
      : profile.profileImage?.url || null;

  /* ================= RENDER ================= */

  return (
    <>
      {isOwnProfile && (
        <DeleteAccountModal
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
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
          onEdit={() => {
            setUpdateError(null);
            setUpdateSuccess(null);
            setEditMode(true);
          }}
          isFollowing={profile.isFollowing}
          onFollowToggle={handleFollowToggle}
          onStatClick={(type) => setActiveModal(type)}
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
          onAddClick={() => setShowCreateModal(true)}
        />

        {isOwnProfile && (
          <DeleteAccountSection
            setShowDeleteConfirm={setShowDeleteConfirm}
          />
        )}
      </div>

      {/* Social & Stats Modals */}
      <UserListModal
        open={activeModal === 'followers'}
        onClose={() => setActiveModal(null)}
        title="Followers"
        userId={profile._id}
        type="followers"
      />
      <UserListModal
        open={activeModal === 'following'}
        onClose={() => setActiveModal(null)}
        title="Following"
        userId={profile._id}
        type="following"
      />
      <CategoryStatsModal
        open={activeModal === 'categories'}
        onClose={() => setActiveModal(null)}
        categories={categories}
      />
 
      {isOwnProfile && (
        <CreateCategoryModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={(newItem) => {
            // New category created/synced
            setCategories(prev => {
              const exists = prev.find(c => c._id === newItem._id);
              if (exists) return prev;
              return [...prev, newItem];
            });
            toast.success("Navigating to category...");
            navigate(`/category/${newItem._id}`);
          }}
        />
      )}
    </>
  );
};

export default Profile;
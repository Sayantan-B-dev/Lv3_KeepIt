import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import EncryptButton from "../components/buttons/EncryptButton";
import Magnet from "../components/advance/Magnet";
import { useAuth } from "../context/AuthContext";

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

  // Editable fields
  const [editProfile, setEditProfile] = useState({});
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const fileInputRef = useRef(null);

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

  const uploadToBackend = async (file) => {
    const data = new FormData();
    data.append("image", file);
    const res = await axiosInstance.post("/api/auth/upload-profile-image", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // if your backend uses cookies/session
    });
    if (!res.data?.url) throw new Error("Failed to upload image to backend");
    return res.data;
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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

    let uploadedImage = profile?.profileImage || null;

    try {
      if (profileImageFile) {
        const backendRes = await uploadToBackend(profileImageFile);
        uploadedImage = {
          url: backendRes.url,
          public_id: backendRes.public_id,
        };
      } else if (profileImagePreview === null) {
        // If image was removed
        uploadedImage = null;
      }

      const res = await axiosInstance.put("/api/profile/MyProfile", {
        username: editProfile.username,
        email: editProfile.email,
        bio: editProfile.bio,
        website: editProfile.website,
        profileImage: uploadedImage,
      });
      setProfile((prev) => ({
        ...prev,
        ...res.data,
      }));
      setEditMode(false);
      setUpdateSuccess("Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      setUpdateError(
        err?.response?.data?.message || "Failed to update profile."
      );
      console.log(err);
    } finally {
      setUpdateLoading(false);
    }
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

  return (
    <Magnet
      padding={50}
      disabled={false}
      magnetStrength={150}
      className="w-full"
    >
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
          backdropFilter: 'blur(2px)',
          backdropShadow: '20px',
          background: 'rgba(255, 255, 255, 0.01)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.20)',
          borderRadius: '60px',
          border: '1px dashed black',
        }}
      >
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
          <div className="w-full flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2 flex-wrap">
              {profile.username}
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${profile.isVerified
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                  }`}
              >
                {profile.isVerified ? "Verified" : "Unverified"}
              </span>
            </h1>
            <div className="flex gap-2 mt-2 sm:mt-3 text-base text-gray-600 font-medium">
              {/* <span className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Joined:</span>
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 flex-wrap">
                <span className="text-xs text-gray-400">Followers:</span>
                {profile.followers?.length || 0}
                <span className="ml-2 text-xs text-gray-400">Following:</span>
                {profile.following?.length || 0}
              </span> */}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 16h8M8 12h8M8 8h8" />
                </svg>
                {profile.notesCount ?? profile.notes?.length ?? 0}
                <span className="ml-1 text-xs text-gray-400">Notes</span>
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                </svg>
                {profile.categoriesCount ?? profile.categories?.length ?? 0}
                <span className="ml-1 text-xs text-gray-400">Categories</span>
              </span>
            </div>
            {/* Add Create Note Button here */}
            <div className="mt-4 flex flex-wrap gap-2">
              <div
                type="button"
                onClick={handleCreateNote}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-none border border-dashed border-black shadow transition cursor-pointer"
                style={{ background: "white" }}
              >
                <span className="font-semibold text-indigo-700 text-base">Create a new Note</span>
              </div>
            </div>
          </div>
        </div>

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
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                />
              ) : (
                <div className="text-xs rounded-xl px-3 py-2 shadow-xl border border-indigo-50 w-full sm:w-fit">
                  <p className="text-black">
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
                  type="url"
                  name="website"
                  value={editProfile.website}
                  onChange={handleInputChange}
                  className="w-full border border-indigo-200 text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  maxLength={128}
                />
              ) : (
                <div className="text-xs rounded-xl px-3 py-2 shadow-xl border border-indigo-50 w-full sm:w-fit">
                  {profile.website ? (
                    <a
                      href={
                        profile.website.startsWith("http")
                          ? profile.website
                          : `https://${profile.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black break-all"
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

          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-4 mt-8">
              Your Categories
            </h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {categories.length === 0 ? (
                <span className="text-gray-400">No categories found.</span>
              ) : (
                categories.map((cat) => (
                  <DottedButton
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat._id)}
                    className="px-4 py-2 border-indigo-300"
                    text={cat.name}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {!editMode ? (
              <button onClick={handleEdit}>
                <EncryptButton />
              </button>
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
                  style={{
                    borderColor: 'black',
                    borderWidth: '1px',
                    borderStyle: 'dashed',
                  }}
                  onClick={handleCancel}
                  disabled={updateLoading}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          {updateError && (
            <div className="mt-4 text-red-500">{updateError}</div>
          )}
          {updateSuccess && (
            <div className="mt-4 text-green-600">{updateSuccess}</div>
          )}
        </form>
      </div>
    </Magnet>
  );
};

export default MyProfile;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Magnet from "../components/advance/Magnet";

const Profile = ({
  user: loggedInUser,
  loading: appLoading,
  error: appError,
  isAuthenticated,
}) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/profile/${userId}`);
        setProfile(res.data);
        setCategories(res.data.categories || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load profile. Please try again later."
        );
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleCategoryClick = (categoryID) => {
    navigate(`/category/${categoryID}`);
  };

  if (appLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-lg text-gray-500">Loading...</span>
      </div>
    );
  }

  if (appError) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-red-500">{appError}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-gray-500">User not found.</span>
      </div>
    );
  }

  return (
    <Magnet
      padding={50}
      disabled={false}
      magnetStrength={50}
      className="w-full"
      overflow="hidden"
    >
      <div
        className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16"
        style={{
          backdropFilter: "blur(2px)",
          backdropShadow: "20px",
          background: "rgba(255, 255, 255, 0.01)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 32px 0 rgba(31, 38, 135, 0.10)",
          borderRadius: "60px",
        }}
      >
        {/* Profile Header */}
        <div className="flex items-center gap-8 mb-10">
          <div className="relative">
            {profile.profileImage ? (
              <img
                src={profile.profileImage.url}
                alt={profile.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-5xl text-indigo-400 font-bold border-4 border-indigo-200 shadow-lg">
                {profile.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            {loggedInUser && loggedInUser._id === profile._id && (
              <span className="absolute -bottom-2 -right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md border-2 border-white animate-pulse">
                You
              </span>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-2">
              {profile.username}
            </h1>
            <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium">
              <span className="flex items-center gap-1">
                {profile.followers?.length || 0}
                <span className="ml-1 text-xs text-gray-400">Followers</span>
              </span>
              <span className="flex items-center gap-1">
                {profile.following?.length || 0}
                <span className="ml-1 text-xs text-gray-400">Following</span>
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col justify-start gap-2">
            <div className="flex flex-row gap-2 items-center">
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-center text-nowrap">Bio : </label>

                <div className="text-xs rounded-xl px-3 py-2 shadow-xl border border-indigo-50 w-fit">
                  <p className="text-black">{profile.bio ? `"${profile.bio}"` : <span className="italic text-gray-400">No bio</span>}</p>
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <label className="block text-sm font-semibold text-gray-700 mb-1 text-nowrap">Website : </label>
                <div className="text-xs rounded-xl px-3 py-2 shadow-xl border border-indigo-50 w-fit" >
                  {profile.website ? (
                    <a
                      href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black"
                    >
                      {profile.website.replace("https://", "").replace("http://", "")}
                    </a>
                  ) : (
                    <span className="italic text-gray-400">No website</span>
                  )}
                </div>
            
            </div>
          </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-indigo-700 mb-2 mt-8">
            Categories
          </h2>
          <div className="flex flex-wrap gap-4">
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

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm italic">
            Viewing <span className="font-bold">{profile.username}</span>
            {"'"}s profile.
          </p>
        </div>
      </div>
    </Magnet>
  );
};

export default Profile;

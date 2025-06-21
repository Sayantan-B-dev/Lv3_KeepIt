import { useEffect, useState } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Magnet from "../components/advance/Magnet";

const Profile = ({ user: loggedInUser, loading: appLoading, error: appError, isAuthenticated }) => {
  const { userId } = useParams();

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleCategoryClick = (categoryID) => {  
    navigate(`/category/${categoryID}`);
  }

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/profile/${userId}`);
        setProfile(res.data);

        const categories = []

        for (const id of res.data.categories) {
          const { data } = await axiosInstance.get(`/api/categories/${id}`);
          categories.push(data);
        }
        setCategories(categories);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load profile. Please try again later."
        );
        console.log(err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

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
    <Magnet padding={50} disabled={false} magnetStrength={5} className="w-full">
    <div className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16" style={{
      backdropFilter: 'blur(2px)',
      backdropShadow: '20px',
      background: 'rgba(255, 255, 255, 0.01)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
      borderRadius: '60px',
    }}>
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
              {profile.followers?.length || 0} <span className="ml-1 text-xs text-gray-400">Followers</span>
            </span>
            <span className="flex items-center gap-1">
              {profile.following?.length || 0} <span className="ml-1 text-xs text-gray-400">Following</span>
            </span>
          </div>
        </div>
      </div>
      {/* Profile Details */}
      <div className="space-y-4 mb-8">
        {profile.bio && (
          <div className="bg-white/80 rounded-xl px-5 py-3 shadow-sm border border-indigo-50">
            <p className="text-lg text-gray-700 italic">"{profile.bio}"</p>
          </div>
        )}
        <div className="flex flex-wrap gap-4 text-gray-600 text-base">
          {profile.location && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              {profile.location}
            </span>
          )}
          {profile.website && (
            <a
              href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 3h7v7m0 0L10 21l-7-7L17 3z"/></svg>
              {profile.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>
      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-black mb-2 text-lg">Categories</h3>
          <ul className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <li key={category._id}>
                <DottedButton
                  onClick={() => handleCategoryClick(category._id)}
                  text={category.name}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm italic">
          Viewing <span className="font-bold ">{profile.username}</span>'s profile.
        </p>
      </div>
    </div>
    </Magnet>
  );
};

export default Profile;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Magnet from "../components/advance/Magnet";
import { useAuth } from "../context/AuthContext";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user: loggedInUser, loading: appLoading, error: appError } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleCategoryClick = (categoryID) => {
    navigate(`/category/${categoryID}`);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/profile/MyProfile`);
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
  }, []);

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
    <Magnet padding={50} disabled={false} magnetStrength={50} className="w-full">
      <div
        className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16"
        style={{
          backdropFilter: 'blur(2px)',
          backdropShadow: '20px',
          background: 'rgba(255, 255, 255, 0.01)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
          borderRadius: '60px',
        }}
      >
        <div className="flex items-center gap-8 mb-10">
          <div className="relative">
            {profile?.profileImage?.url ? (
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
            <span className="absolute -bottom-2 -right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md border-2 border-white animate-pulse">
              You
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-2">
              {profile.username}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${profile.isVerified ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                {profile.isVerified ? "Verified" : "Unverified"}
              </span>
            </h1>
            <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium">
              <span className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Joined:</span>
                {new Date(profile.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {profile.bio && (
          <div className="bg-white/80 rounded-xl px-5 py-3 shadow-sm border border-indigo-50 mb-8">
            <p className="text-lg text-gray-700 italic">"{profile.bio}"</p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Your Categories</h2>
          <div className="flex flex-wrap gap-4">
            {console.log(categories)}
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
      </div>
    </Magnet>
  );
};

export default MyProfile;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Magnet from "../components/advance/Magnet";
import Loading from "../components/home/Loading";

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
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Check if loggedInUser is following this profile
  useEffect(() => {
    if (
      loggedInUser &&
      profile &&
      Array.isArray(profile.followers) &&
      profile.followers.includes(loggedInUser._id)
    ) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [loggedInUser, profile]);

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

  if (loading) {
    return <Loading />;
  }

  // const handleFollow = async () => {
  //   if (!isAuthenticated || !loggedInUser || !profile) return;
  //   setFollowLoading(true);
  //   setFollowError(null);
  //   try {
  //     const res = await axiosInstance.post(`/api/profile/${profile._id}/follow`);
  //     // Update followers in profile state
  //     setProfile((prev) => ({
  //       ...prev,
  //       followers: res.data.followers,
  //     }));
  //     setIsFollowing(true);
  //   } catch (err) {
  //     setFollowError(
  //       err.response?.data?.message ||
  //         "Failed to follow user. Please try again later."
  //     );
  //   } finally {
  //     setFollowLoading(false);
  //   }
  // };

  // const handleUnfollow = async () => {
  //   if (!isAuthenticated || !loggedInUser || !profile) return;
  //   setFollowLoading(true);
  //   setFollowError(null);
  //   try {
  //     const res = await axiosInstance.post(`/api/profile/${profile._id}/unfollow`);
  //     setProfile((prev) => ({
  //       ...prev,
  //       followers: res.data.followers,
  //     }));
  //     setIsFollowing(false);
  //   } catch (err) {
  //     setFollowError(
  //       err.response?.data?.message ||
  //         "Failed to unfollow user. Please try again later."
  //     );
  //   } finally {
  //     setFollowLoading(false);
  //   }
  // };



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

  // Only show follow/unfollow if viewing someone else's profile and logged in
  // const showFollow =
  //   isAuthenticated &&
  //   loggedInUser &&
  //   profile &&
  //   loggedInUser._id !== profile._id;

  return (
    <Magnet
      padding={50}
      disabled={false}
      magnetStrength={50}
      className="w-full"
      overflow="hidden"
    >
      <div
        className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16 w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl"
        style={{
          backdropFilter: "blur(2px)",
          backdropShadow: "20px",
          background: "rgba(255, 255, 255, 0.01)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 4px 32px 0 rgba(31, 38, 135, 0.10)",
          borderRadius: "60px",
          border: '1px dashed black',
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
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
              {profile.username}
            </h3>
            <div className="flex flex-row gap-4 items-center mt-3 text-base text-gray-600 font-medium">
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
            {/* <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium">
              <span className="flex items-center gap-1">
                {profile.followers?.length || 0}
                <span className="ml-1 text-xs text-gray-400">Followers</span>
              </span>
              <span className="flex items-center gap-1">
                {profile.following?.length || 0}
                <span className="ml-1 text-xs text-gray-400">Following</span>
              </span>
            </div>
            {showFollow && (
              <div className="mt-4">
                <div
                  className={`inline-block px-6 py-2 rounded-full font-semibold text-sm cursor-pointer transition-all border border-indigo-300 shadow-md ${
                    isFollowing
                      ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  } ${followLoading ? "opacity-60 pointer-events-none" : ""}`}
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  tabIndex={0}
                  role="button"
                  aria-disabled={followLoading}
                >
                  {followLoading
                    ? isFollowing
                      ? "Unfollowing..."
                      : "Following..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </div>
                {followError && (
                  <div className="mt-2 text-xs text-red-500">{followError}</div>
                )}
              </div>
            )} */}
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
          <h2 className="text-lg font-semibold text-black text-center mb-2 mt-8">
            Categories :
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.length === 0 ? (
              <span className="text-gray-400">No categories found.</span>
            ) : (
              categories.map((cat) => (
                <DottedButton
                  key={cat._id}
              style={{fontSize:"12px"}}

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

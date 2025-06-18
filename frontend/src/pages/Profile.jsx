import { useEffect, useState } from "react";
import { useParams,useNavigate  } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

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
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-6 mb-6">
        {profile.profileImage && (
          <img
            src={profile.profileImage.url}
            alt={profile.username}
            className="w-24 h-24 rounded-full object-cover border"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{profile.username}</h1>
          {loggedInUser && loggedInUser._id === profile._id && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              You
            </span>
          )}

        </div>
      </div>
      <div>
        <div className="flex gap-4 mt-2 text-sm text-gray-600">
          <span>Followers: {profile.followers?.length || 0}</span>
          <span>Following: {profile.following?.length || 0}</span>
        </div>
        {profile.bio && <p>{profile.bio}</p>}
        {profile.location && <p>{profile.location}</p>}
        {profile.website && <p>{profile.website}</p>}
        {
          categories.length > 0 && (
            <div>
              <h3 className="font-semibold mt-2">Categories:</h3>
              <ul className="flex gap-2 cursor-pointer flex-wrap">
                {categories.map((category) => (
                  <a 
                    key={category._id} 
                    className="text-blue-500 hover:text-blue-700 text-sm" 
                    onClick={()=>handleCategoryClick(category._id)}
                  >
                    {category.name}
                  </a>
                ))}
              </ul>
            </div>
          )
        }

      </div>
      <div>
        <p className="text-gray-600">Viewing {profile.username}'s profile.</p>
      </div>
    </div>
  );
};

export default Profile;

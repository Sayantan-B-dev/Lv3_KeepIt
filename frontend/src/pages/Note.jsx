import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Magnet from "../components/advance/Magnet";
import Loading from "../components/home/Loading";
import Author from "../components/Author";

const Note = () => {
  const { noteId } = useParams();

  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState(null);
  const [user, setUser] = useState(null);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  }
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  }



  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/notes/${noteId}`);
        setNote(res.data);
        console.log(res.data);

        const category = await axiosInstance.get(`/api/categories/${res.data.category}`);
        setCategory(category.data);

        const user = await axiosInstance.get(`/api/profile/${res.data.user}`);
        setUser(user.data);
    
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load note. Please try again later."
        );
        setNote(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!note) {
    return <div>Note not found.</div>;
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
        <Author user={user} handleUserClick={handleUserClick} />
        {/* Note Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-4xl text-indigo-400 font-bold border-4 border-indigo-200 shadow-lg">
              {note.title?.[0]?.toUpperCase() || "?"}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-2">
              {note.title}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${note.isPrivate ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                {note.isPrivate ? "Private" : "Public"}
              </span>
            </h1>
            <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium">
              <span className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Created:</span>
                {new Date(note.createdAt).toLocaleString()}
              </span>

            </div>
          </div>
        </div>
        {/* Category */}
        <div className="mb-8 flex items-center gap-4">
          <span className="block font-semibold text-gray-700">Category:</span>
          <DottedButton
            onClick={() => handleCategoryClick(category._id)}
            text={category?.name || note.category}
          />
        </div>
        {/* Content */}
        <div className="mb-8">
          <h2 className="font-semibold text-black mb-2 text-lg">Content</h2>
          <div className="bg-white/80 rounded-xl px-5 py-4 shadow-sm border border-indigo-50 whitespace-pre-line text-gray-800">
            {note.content}
          </div>
        </div>
        {/* Likes */}
        <div className="flex items-center gap-2 mt-6">
          <span className="font-semibold text-gray-700">Likes:</span>
          <span className="text-indigo-600 font-bold">{note.likes ? note.likes.length : 0}</span>
        </div>
        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm italic">
            Viewing note <span className="font-bold">{note.title}</span>.
          </p>
        </div>
      </div>
    </Magnet>
  );
};

export default Note;

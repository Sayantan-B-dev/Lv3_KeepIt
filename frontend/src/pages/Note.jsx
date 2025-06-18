import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!note) {
    return <div>Note not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{note.title}</h1>
      <div className="mb-2">
        <span className="text-gray-600 text-sm">
          {note.isPrivate ? "Private" : "Public"}
        </span>
      </div>
      <div className="text-gray-500 text-xs mb-2">
        Created: {new Date(note.createdAt).toLocaleString()}
      </div>
      <div className="text-gray-500 text-xs mb-4">
        Updated: {new Date(note.updatedAt).toLocaleString()}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Author: </span>
        <a onClick={()=>handleUserClick(user._id)}>{user?.username || note.user}</a>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Category: </span>
        <a onClick={()=>handleCategoryClick(category._id)}>{category?.name || note.category}</a>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-1">Content:</h2>
        <div className="whitespace-pre-line">{note.content}</div>
      </div>
      <div>
        <span className="font-semibold">Likes: </span>
        {note.likes ? note.likes.length : 0}
      </div>
    </div>
  );
};

export default Note;

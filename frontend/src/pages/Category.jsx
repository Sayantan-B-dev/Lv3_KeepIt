import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const Category = ({ user: loggedInUser, loading: appLoading, error: appError, isAuthenticated }) => {
    const { categoryId } = useParams();

    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);

    const handleNoteClick = (noteId) => {
        navigate(`/note/${noteId}`);
    }
    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    }
    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get(`/api/categories/${categoryId}`);
                setCategory(res.data);

                const notes = []

                for (const id of res.data.notes) {
                    const { data } = await axiosInstance.get(`/api/notes/${id}`);
                    notes.push(data);
                }

                setNotes(notes);

                const user = await axiosInstance.get(`/api/profile/${res.data.user}`);
                setUser(user.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load category. Please try again later."
                );
                setCategory(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [categoryId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!category) {
        return <div>Category not found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">{category.name}</h1>
            <div className="mb-2">
                <span className="text-gray-600 text-sm">
                    {category.isPrivate ? "Private" : "Public"}
                </span>
            </div>
            <div className="mb-4">
                <span className="font-semibold">Author: </span>
                <a onClick={()=>handleUserClick(user._id)}>{user?.username}</a>
            </div>
            <div className="text-gray-500 text-xs mb-4">
                Created: {new Date(category.createdAt).toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs mb-4">
                Updated: {new Date(category.updatedAt).toLocaleString()}
            </div>
            <div>
                <h2 className="font-semibold mt-4 mb-2">Notes:</h2>
                {notes && notes.length > 0 ? (
                    <ul className="list-disc ml-6 flex flex-col gap-2">
                        {notes.map((note) => (
                            <a
                                key={note._id}
                                className="text-blue-500 hover:text-blue-700 text-sm"
                                onClick={() => handleNoteClick(note._id)}
                            >
                                {note.title}
                            </a>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No notes in this category.</p>
                )}
            </div>
        </div>
    );
};

export default Category;

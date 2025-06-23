import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Magnet from "../components/advance/Magnet";

const Category = ({ user: loggedInUser, loading: appLoading, error: appError, isAuthenticated }) => {
    const { categoryId } = useParams();

    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

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
                setNotes(res.data.notes || []);
                setUser(res.data.user);
                setProfile(res.data.user);
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
        <Magnet padding={50} disabled={false} magnetStrength={50} className="w-full">
            <div className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16"
                style={{
                    backdropFilter: 'blur(2px)',
                    backdropShadow: '20px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
                    borderRadius: '60px',
                }}
            >
                {/* Category Header */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-4xl text-indigo-400 font-bold border-4 border-indigo-200 shadow-lg">
                            {category.name?.[0]?.toUpperCase() || "?"}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-2">
                            {category.name}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${category.isPrivate ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                                {category.isPrivate ? "Private" : "Public"}
                            </span>
                        </h1>
                        <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium">
                            <span className="flex items-center gap-1">
                                <span className="text-xs text-gray-400">Created:</span>
                                {new Date(category.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Author */}
                <div className="mb-8 flex items-center gap-6">
                <span className="block font-semibold text-gray-700 mb-1">Author:</span>

                    <div className="relative" >
                        {user?.profileImage?.url ? (
                            <img
                                src={user.profileImage.url}
                                alt={user.username}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-indigo-200 shadow-xl transition-transform duration-300 hover:scale-105"
                                onClick={() => handleUserClick(user._id)}
                            />
                        ) : (
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-indigo-100 flex items-center justify-center text-4xl text-indigo-400 font-bold border-4 border-indigo-200 shadow-xl cursor-pointer"
                                onClick={() => handleUserClick(user._id)}>
                                {user?.username?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                        <span className="absolute bottom-2 right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full shadow-md cursor-pointer" onClick={() => handleUserClick(user._id)}>
                        {user?.username}
                        </span>
                    </div>
                </div>
                {/* Notes */}
                <div className="mb-8">
                    <h2 className="font-semibold text-black mb-2 text-lg">Notes</h2>
                    {notes && notes.length > 0 ? (
                        <ul className="flex flex-wrap gap-3">
                            {notes.map((note) => (
                                <li key={note._id}>
                                    <DottedButton
                                        onClick={() => handleNoteClick(note._id)}
                                        text={note.title}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 italic">No notes in this category.</p>
                    )}
                </div>
                {/* Footer */}
                <div className="mt-10 text-center">
                    <p className="text-gray-500 text-sm italic">
                        Viewing <span className="font-bold">{category.name}</span> category.
                    </p>
                </div>
            </div>
        </Magnet>
    );
};

export default Category;

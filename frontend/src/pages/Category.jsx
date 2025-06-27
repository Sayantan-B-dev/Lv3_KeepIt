import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Magnet from "../components/advance/Magnet";
import Author from "../components/Author";

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
        <>
            <Magnet padding={50} disabled={false} magnetStrength={50} className="w-full">
                <div className="container mx-auto p-6 max-w-3xl shadow-2xl border-1 border-dashed border-black mt-10 mb-2 relative"
                    style={{
                        backdropFilter: 'blur(2px)',
                        backdropShadow: '20px',
                        background: 'rgba(255, 255, 255, 0.01)',
                        WebkitBackdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
                        borderTopLeftRadius: '60px',
                        borderTopRightRadius: '60px',
                        borderBottomLeftRadius: '0px',
                        borderBottomRightRadius: '0px',
                    }}
                >
                    <Author user={user} handleUserClick={handleUserClick} />

                    {/* Category Header */}
                    <div className="flex items-center justify-center gap-6 mb-2">
                        <div className="relative">
                            <p className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                                Category
                            </p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold text-gray-900 flex items-center gap-2">
                                {category.name}
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${category.isPrivate ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                                    {category.isPrivate ? "Private" : "Public"}
                                </span>
                            </h3>
                            <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium">
                                <span className="flex items-center gap-1">
                                    <span className="text-xs text-gray-400">Created:</span>
                                    {new Date(category.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Magnet>
            <div className="mb-8 container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border-1 border-black "
                style={{
                    backdropFilter: 'blur(2px)',
                    backdropShadow: '20px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
                    borderTopLeftRadius: '0px',
                    borderTopRightRadius: '0px',
                    borderBottomLeftRadius: '60px',
                    borderBottomRightRadius: '60px',
                }}>
                <div className="mb-8">
                    <h2 className="font-semibold text-black mb-2 text-2xl text-center">Contents</h2>
                    {notes && notes.length > 0 ? (
                        <ul className="flex flex-wrap gap-3">
                            {notes.map((note, index) => (
                                <Magnet key={note._id} padding={5} disabled={false} magnetStrength={20} className="w-full">
                                    <li key={note._id}>
                                        <DottedButton
                                            className="w-full text-left"
                                            onClick={() => handleNoteClick(note._id)}
                                            text={index + 1 + ". " + note.title}
                                        />
                                    </li></Magnet>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 italic">No notes in this category.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Category;

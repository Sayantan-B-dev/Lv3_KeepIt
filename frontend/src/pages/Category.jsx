import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Magnet from "../components/advance/Magnet";
import Author from "../components/Author";
import ConfirmPopUp from "../components/ConfirmPopUp"; 
import Loading from "../components/home/Loading";
import { toast } from "react-toastify";

const backdropStyle = {
    backdropFilter: 'blur(2px)',
    backdropShadow: '20px',
    background: 'rgba(255, 255, 255, 0.01)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
};

const Category = ({ user: loggedInUser, loading: appLoading, error: appError, isAuthenticated }) => {
    const { categoryId } = useParams();

    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const handleNoteClick = (noteId) => {
        navigate(`/note/${noteId}`);
    };
    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    // When deleting a category, also delete all notes in it
    const handleDeleteCategory = async () => {
        setDeleting(true);
        setError(null);
        try {
            // First, delete all notes in this category
            toast.success("Category deleted successfully");
            if (notes && notes.length > 0) {
                // Use Promise.all to delete all notes in parallel
                await Promise.all(
                    notes.map(note =>
                        axiosInstance.delete(`/api/notes/${note._id}`)
                    )
                );
            }
            // Then, delete the category itself
            await axiosInstance.delete(`/api/categories/${categoryId}`);
            setShowDeletePopup(false);
            navigate("/profile/MyProfile");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to delete category and its notes. Please try again later."
            );
        } finally {
            setDeleting(false);
        }
    };

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
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!category) {
        return <div>Category not found.</div>;
    }

    // Determine if the logged-in user is the owner of the category
    const isOwner =
        loggedInUser &&
        category.user &&
        (loggedInUser._id === category.user._id || loggedInUser._id === category.user);

    return (
        <>
            <ConfirmPopUp
                open={showDeletePopup}
                onClose={() => setShowDeletePopup(false)}
                onConfirm={handleDeleteCategory}
                loading={deleting}
                message="Are you sure you want to delete this category? This will also delete all notes in this category. This action cannot be undone."
                backdropStyle={backdropStyle}
            />
            <Magnet padding={50} disabled={false} magnetStrength={50} className="w-full">
                <div className="container mx-auto p-6 max-w-3xl shadow-2xl border-1 border-dashed border-black mt-10 mb-2 relative w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl"
                    style={{
                        ...backdropStyle,
                        borderTopLeftRadius: '60px',
                        borderTopRightRadius: '60px',
                        borderBottomLeftRadius: '0px',
                        borderBottomRightRadius: '0px',
                    }}
                >
                    <Author user={user} handleUserClick={handleUserClick} />

                    {/* Category Header */}
                    <div className="flex items-center justify-center gap-6 mb-2">
                        <div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2 ">
                            <p className="text-sm font-extrabold text-gray-900 flex items-center gap-2 ">
                                Category : 
                            </p>
                                {category.name}
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${category.isPrivate ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                                    {category.isPrivate ? "Private" : "Public"}
                                </span>
                            </h3>
                            <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium">
                                <span className="flex items-center gap-1 text-xs    ">
                                    <span className="text-xs text-gray-400">Created:</span>
                                    {new Date(category.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                {isOwner && (
                                    <button
                                        className="ml-4 p-1 rounded-full text-gray-400 hover:text-red-500 transition cursor-pointer"
                                        onClick={() => setShowDeletePopup(true)}
                                        disabled={deleting}
                                        title="Delete this category"
                                        style={{ background: "none", border: "none", outline: "none" }}
                                    >
                                        {deleting ? (
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m5 0H4" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Magnet>
            <div className="mb-8 container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border-1 border-black w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl"
                style={{
                    ...backdropStyle,
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
                                    </li>
                                </Magnet>
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

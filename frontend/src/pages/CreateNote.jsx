import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import Magnet from "../components/advance/Magnet";
import DottedButton from "../components/buttons/DottedButton";
import Loading from "../components/home/Loading";
import { toast } from "react-toastify";

const textAreaStyle =
    "w-full border border-gray-300 rounded-lg px-4 py-2 resize-vertical focus:outline-none focus:ring-1 focus:ring-black text-black";

const CreateNote = ({ user, loading, error, isAuthenticated, categories }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [formError, setFormError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (typeof isAuthenticated !== "undefined" && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    // If loading authentication/user info, show loading
    if (loading) {
        return (
            <Loading />
        );
    }

    // If not authenticated, don't render form (redirect handled above)
    if (!isAuthenticated) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSuccess(false);

        if (!title.trim() || !content.trim() || !category.trim()) {
            setFormError("All fields are required.");
            return;
        }

        try {
            const response = await axiosInstance.post("/api/notes", {
                title,
                content,
                category,
            });
            //console.log(response.data);

            setSuccess(true);
            toast.success("Note created successfully");

            setTitle("");
            setContent("");
            setCategory("");

            // Navigate after a short delay
            setTimeout(() => {
                navigate("/profile/MyProfile");
            }, 1000);
        } catch (err) {
            let errorMsg = "Failed to create note. Please try again.";
            if (err.response?.data?.error) {
                errorMsg = err.response.data.error;
            } else if (err.message) {
                errorMsg = err.message;
            }
            setFormError(errorMsg);
        }
    };

    return (
        <Magnet
            padding={50}
            disabled={false}
            magnetStrength={20}
            className="w-full"
        >
            <div
                className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16 w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl"
                style={{
                    backdropFilter: 'blur(2px)',
                    backdropShadow: '20px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
                    borderRadius: '60px',
                    border: '1px dashed black',
                }}>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                    Create a New Note
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            className={textAreaStyle}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Content
                        </label>
                        <textarea
                            className={`${textAreaStyle} h-32`}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note here... (You can add a clickable link by including a full URL, e.g. https://example.com. Links will be clickable when viewing the note.)"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            className={textAreaStyle}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Personal, Work, Ideas"
                        />
                    </div>
                    {formError && (
                        <div className="text-red-500 font-medium">{formError}</div>
                    )}
                    {success && (
                        <div className="text-green-600 font-medium">
                            Note created! Redirecting...
                        </div>
                    )}
                    <DottedButton
                        text="Create Note"
                        className="w-full"
                        onClick={handleSubmit}
                    />
                </form>
            </div>
        </Magnet>
    );
};

export default CreateNote;

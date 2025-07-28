import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import DottedButton from "../components/buttons/DottedButton";
import Loading from "../components/home/Loading";
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';
import TagInput from '../components/TagInput';

const textAreaStyle =
    "w-full border border-gray-300 rounded-lg px-4 py-2 resize-vertical focus:outline-none focus:ring-1 focus:ring-black text-black";

const CreateNote = () => {
    const location = useLocation();
    const preselectedCategory = location.state?.category;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState(
        preselectedCategory ? preselectedCategory : ""
    );
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const isAuthenticated = !!user;

    useEffect(() => {
        if (preselectedCategory) {
            setCategory(preselectedCategory);
        }
    }, [preselectedCategory]);

    useEffect(() => {
        if (typeof isAuthenticated !== "undefined" && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (loading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setSuccess(false);

        let categoryName = "";
        let categoryId = "";
        if (preselectedCategory) {
            categoryName = preselectedCategory.name;
            categoryId = preselectedCategory._id;
        } else if (typeof category === "string") {
            categoryName = category.trim();
        }

        if (!title.trim() || !content.trim() || !categoryName) {
            setFormError("All fields are required.");
            return;
        }

        try {
            const response = await axiosInstance.post("/api/notes", {
                title,
                content,
                category: categoryName,
                tags,
            });

            setSuccess(true);
            toast.success("Note created successfully");

            setTitle("");
            setContent("");
            setCategory(preselectedCategory ? preselectedCategory : "");
            setTags([]);

            setTimeout(() => {
                let redirectCategoryId = categoryId;
                if (!redirectCategoryId && response.data && response.data.category) {
                    if (typeof response.data.category === "string") {
                        redirectCategoryId = response.data.category;
                    } else if (typeof response.data.category === "object" && response.data.category._id) {
                        redirectCategoryId = response.data.category._id;
                    }
                }
                if (redirectCategoryId) {
                    navigate(`/category/${redirectCategoryId}`);
                } else {
                    navigate("/");
                }
            }, 500);
        } catch (err) {
            let errorMsg = "Failed to create note. Please try again.";
            if (err.response?.data?.error) {
                errorMsg = err.response.data.error;
            } else if (err.message) {
                errorMsg = err.message;
            }
            if (
                err.response?.data?.error &&
                err.response.data.error.includes("note with this title")
            ) {
                errorMsg = "You already have a note with this title. Please choose a different title.";
            }
            setFormError(errorMsg);
        }
    };

    return (
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
                        <div className="text-xs text-gray-500 mt-1">
                          <span>
                            <b>Markdown supported:</b> You can use <b>**bold**</b>, <i>*italic*</i>, <code>`inline code`</code>, <code>```code blocks```</code>, lists, headings (<code>#</code>, <code>##</code>, etc.), blockquotes (<code>&gt; quote</code>), and more.<br />
                            <b>Links:</b> Paste a full URL (e.g. <code>https://example.com</code>) and it will be clickable when viewing the note.<br />
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Category
                    </label>
                    <input
                        type="text"
                        className={
                            preselectedCategory
                                ? `${textAreaStyle} bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed`
                                : textAreaStyle
                        }
                        value={
                            preselectedCategory
                                ? preselectedCategory.name
                                : category
                        }
                        onChange={
                            preselectedCategory
                                ? undefined // If thisCategory is passed, disable editing
                                : (e) => setCategory(e.target.value)
                        }
                        placeholder="e.g. Personal, Work, Ideas"
                        disabled={!!preselectedCategory}
                    />
                    {preselectedCategory && (
                        <div className="text-xs text-gray-400 mt-1 ml-1">
                            Category is preselected and cannot be changed.
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                        Tags
                    </label>
                    <TagInput
                        value={tags}
                        onChange={setTags}
                        placeholder="Add tags (press Enter or comma)"

                    />
                    <div className="text-xs text-gray-500 mt-1">
                        Add multiple tags to help organize and search your notes. Max 30 chars per tag.
                    </div>
                </div>
                {formError && (
                    <div className="text-red-500 font-medium text-center">{formError}</div>
                )}
                {success && (
                    <div className="text-green-600 font-medium text-center">
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
    );
};

export default CreateNote;

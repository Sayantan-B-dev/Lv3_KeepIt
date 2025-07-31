// Why doesn't refreshing the page remove form field values?
// ----------------------------------------------------------
// This component saves the form field values (title, content, category, tags, categoryType)
// to localStorage on every change (see the useEffect that writes to localStorage).
// When the page is refreshed, the component's initial state is loaded from localStorage
// (see the initialDraft function). This means the form fields are "restored" from the
// last saved draft, so refreshing the page does NOT clear the form fields.
// The draft is only removed from localStorage after a successful note creation
// (see the useEffect that runs when 'success' is true, and also after handleSubmit).
// ----------------------------------------------------------

import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import DottedButton from "../components/buttons/DottedButton";
import Loading from "../components/home/Loading";
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';
import TagInput from '../components/TagInput';

const textAreaStyle =
    "w-full border border-gray-700 rounded-lg px-4 py-2 resize-vertical focus:outline-none focus:ring-1 focus:ring-black text-black";

// Key for localStorage
const LOCAL_STORAGE_KEY = "createnote_draft_v1";

const CreateNote = () => {
    const location = useLocation();
    const preselectedCategory = location.state?.category;
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const isAuthenticated = !!user;

    // --- Load draft from localStorage if present ---
    const initialDraft = (() => {
        try {
            const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                // If preselectedCategory is present, override category/categoryType
                if (preselectedCategory) {
                    parsed.category = preselectedCategory;
                    if (preselectedCategory.type) {
                        parsed.categoryType = preselectedCategory.type;
                    }
                }
                return parsed;
            }
        } catch (e) {}
        // If no draft, use defaults
        return {
            title: "",
            content: "",
            category: preselectedCategory ? preselectedCategory : "",
            tags: [],
            categoryType: preselectedCategory && preselectedCategory.type ? preselectedCategory.type : "",
        };
    })();

    const [title, setTitle] = useState(initialDraft.title);
    const [content, setContent] = useState(initialDraft.content);
    const [category, setCategory] = useState(initialDraft.category);
    const [tags, setTags] = useState(initialDraft.tags);
    const [formError, setFormError] = useState(null);
    const [success, setSuccess] = useState(false);
    // If preselectedCategory exists, use its type, otherwise empty string
    const [categoryType, setCategoryType] = useState(
        initialDraft.categoryType
    );

    // Save draft to localStorage on any change
    useEffect(() => {
        // Don't save if not authenticated
        if (!isAuthenticated) return;
        // Don't save if success (note created)
        if (success) return;
        // Don't save if all fields are empty
        if (
            !title &&
            !content &&
            (!category || (typeof category === "object" && !category.name)) &&
            (!tags || tags.length === 0) &&
            !categoryType
        ) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return;
        }
        // Save
        const toSave = {
            title,
            content,
            // Save only the name for category if preselected, else string
            category: preselectedCategory ? preselectedCategory : category,
            tags,
            categoryType,
        };
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave));
        } catch (e) {}
    }, [title, content, category, tags, categoryType, preselectedCategory, isAuthenticated, success]);

    // Remove draft from localStorage after successful creation
    useEffect(() => {
        if (success) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }, [success]);

    // If preselectedCategory changes, update category/categoryType
    useEffect(() => {
        if (preselectedCategory) {
            setCategory(preselectedCategory);
            if (preselectedCategory.type) {
                setCategoryType(preselectedCategory.type);
            }
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
        let categoryTypeValue = categoryType;
        if (preselectedCategory) {
            categoryName = preselectedCategory.name;
            categoryId = preselectedCategory._id;
            // Always use the type from preselectedCategory if present
            if (preselectedCategory.type) {
                categoryTypeValue = preselectedCategory.type;
            }
        } else if (typeof category === "string") {
            categoryName = category.trim();
        }

        if (!title.trim() || !content.trim() || !categoryName || !categoryTypeValue) {
            setFormError("All fields are required.");
            return;
        }

        try {
            const response = await axiosInstance.post("/api/notes", {
                title,
                content,
                category: categoryName,
                tags,
                type: categoryTypeValue,
            });

            setSuccess(true);
            toast.success("Note created successfully");

            setTitle("");
            setContent("");
            setCategory(preselectedCategory ? preselectedCategory : "");
            setTags([]);
            setCategoryType(preselectedCategory && preselectedCategory.type ? preselectedCategory.type : "");

            // Remove draft from localStorage
            localStorage.removeItem(LOCAL_STORAGE_KEY);

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
                        className={`${textAreaStyle} h-75`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your note here... (You can adjast the size of the text area by dragging the bottom right corner)"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        <span>
                            <b>Markdown supported:</b> You can use <b>**bold**</b>, <i>*italic*</i>, <code>`inline code`</code>, <code>```code blocks```</code>, lists, headings (<code>#</code>, <code>##</code>, etc.), blockquotes (<code>&gt; quote</code>), and more.<br />
                            <b>Links:</b> Paste a full URL (e.g. <code>https://example.com</code>) and it will be clickable when viewing the note.<br />
                        </span>
                    </div>
                </div>
                <div className="flex flex-row gap-4 justify-between">
                    <div className="flex-grow">
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
                            Category Type
                        </label>
                        <input
                            type="text"
                            className={
                                preselectedCategory
                                    ? `${textAreaStyle} bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed`
                                    : textAreaStyle
                            }
                            value={
                                preselectedCategory && preselectedCategory.type
                                    ? preselectedCategory.type
                                    : categoryType
                            }
                            onChange={
                                preselectedCategory && preselectedCategory.type
                                    ? undefined // If preselected, don't allow editing
                                    : (e) => setCategoryType(e.target.value)
                            }
                            placeholder="e.g. work, personal, ideas"
                            pattern="^\\w+$"
                            title="Type must be a single word (no spaces or special characters)."
                            disabled={!!(preselectedCategory && preselectedCategory.type)}
                        />
                        {preselectedCategory && preselectedCategory.type && (
                            <div className="text-xs text-gray-400 mt-1 ml-1">
                                Category type is preselected and cannot be changed.
                            </div>
                        )}
                    </div>
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

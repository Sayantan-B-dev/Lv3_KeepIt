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

import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";
;
import { useNavigate, useLocation } from "react-router-dom";
import { DottedButton } from "@/components/ui/buttons";
import { Loading } from "@/features/home";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import TagInput from "@/components/common/TagInput";
import { MdUndo, MdRedo } from "react-icons/md";

const textAreaStyle =
    "textAreaStyle";

// Key for localStorage
const LOCAL_STORAGE_KEY = "createnote_draft_v1";

// Maximum undo stack size for content field
const MAX_UNDO_STACK = 30;

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
        } catch (e) { }
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

    // For drag-and-drop
    const dropRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);

    // --- Undo stack for content field ---
    const [contentUndoStack, setContentUndoStack] = useState([initialDraft.content]);
    const [contentRedoStack, setContentRedoStack] = useState([]);
    const contentInputRef = useRef(null);

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
        } catch (e) { }
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

    // --- Markdown file upload handler (for both input and drag-and-drop) ---
    const handleMdFile = useCallback((file) => {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.md')) {
            toast.error("Please upload a .md (Markdown) file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            const fileContent = event.target.result;
            const fileTitle = file.name.replace(/\.md$/i, "");
            setTitle(fileTitle);
            setContent(fileContent);
            setContentUndoStack([fileContent]);
            setContentRedoStack([]);
            toast.success("Markdown file loaded! You can review and submit.");
        };
        reader.onerror = function () {
            toast.error(`Failed to read file: ${file.name}`);
        };
        reader.readAsText(file);
    }, []);

    // For file input
    const handleMdUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        handleMdFile(files[0]);
        // Clear the input value so the same file can be uploaded again
        e.target.value = "";
    };

    // For drag-and-drop
    useEffect(() => {
        const dropArea = dropRef.current;
        if (!dropArea) return;

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(true);
        };
        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(true);
        };
        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(false);
        };
        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(false);
            const files = Array.from(e.dataTransfer.files);
            if (!files.length) return;
            const file = files[0];
            handleMdFile(file);
        };

        dropArea.addEventListener("dragover", handleDragOver);
        dropArea.addEventListener("dragenter", handleDragEnter);
        dropArea.addEventListener("dragleave", handleDragLeave);
        dropArea.addEventListener("drop", handleDrop);

        return () => {
            dropArea.removeEventListener("dragover", handleDragOver);
            dropArea.removeEventListener("dragenter", handleDragEnter);
            dropArea.removeEventListener("dragleave", handleDragLeave);
            dropArea.removeEventListener("drop", handleDrop);
        };
    }, [handleMdFile]);

    // --- Undo/Redo logic for content field ---
    // Push to undo stack only if content actually changes
    const handleContentChange = (e) => {
        const newValue = e.target.value;
        // Only push if different from last
        if (contentUndoStack.length === 0 || contentUndoStack[contentUndoStack.length - 1] !== newValue) {
            let newStack = [...contentUndoStack, newValue];
            if (newStack.length > MAX_UNDO_STACK) {
                newStack = newStack.slice(newStack.length - MAX_UNDO_STACK);
            }
            setContentUndoStack(newStack);
            setContentRedoStack([]); // Clear redo stack on new input
        }
        setContent(newValue);
    };

    const handleUndo = () => {
        if (contentUndoStack.length > 1) {
            const newRedoStack = [contentUndoStack[contentUndoStack.length - 1], ...contentRedoStack];
            const newUndoStack = contentUndoStack.slice(0, -1);
            setContent(newUndoStack[newUndoStack.length - 1]);
            setContentUndoStack(newUndoStack);
            setContentRedoStack(newRedoStack);
            // Focus textarea after undo for better UX
            if (contentInputRef.current) {
                contentInputRef.current.focus();
            }
        }
    };

    const handleRedo = () => {
        if (contentRedoStack.length > 0) {
            const redoValue = contentRedoStack[0];
            const newUndoStack = [...contentUndoStack, redoValue];
            let trimmedUndoStack = newUndoStack;
            if (trimmedUndoStack.length > MAX_UNDO_STACK) {
                trimmedUndoStack = trimmedUndoStack.slice(trimmedUndoStack.length - MAX_UNDO_STACK);
            }
            setContent(redoValue);
            setContentUndoStack(trimmedUndoStack);
            setContentRedoStack(contentRedoStack.slice(1));
            if (contentInputRef.current) {
                contentInputRef.current.focus();
            }
        }
    };

    // Keyboard shortcuts for undo/redo (Ctrl+Z, Ctrl+Y) for desktop
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Only if textarea is focused
            if (document.activeElement !== contentInputRef.current) return;
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
                e.preventDefault();
                handleUndo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line
    }, [contentUndoStack, contentRedoStack]);

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
            setContentUndoStack([""]);
            setContentRedoStack([]);

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

    // --- Helper: Detect if device is mobile (for showing undo/redo buttons more prominently) ---
    // (No longer needed for button display logic, but keep for possible future use)
    const isMobile = (() => {
        if (typeof window === "undefined") return false;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    })();

    return (
        <div
            className="
                w-full
                mb-5
                p-6 md:p-10
                rounded-lg
                border border-muted
                glass-panel
                shadow-xl
                bg-type-b1
            "

        >
            {/* Header */}
            <h2 className="
                text-3xl
                font-mono font-bold
                text-type-1
                mb-8
                text-center
                tracking-tight
            ">
                Create a New Note
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8 font-mono">

                {/* Title */}
                <div className="">
                    <label className="block text-type-2 font-mono mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        className={`${textAreaStyle}`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter note title"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-type-2 font-mono mb-2">
                        Content
                    </label>

                    <div className="relative">
                        <textarea
                            ref={contentInputRef}
                            className={`
                                ${textAreaStyle}
                                h-75
                                pr-12
                                resize
                            `}
                            value={content}
                            onChange={handleContentChange}
                            placeholder="Write your note here… (Markdown supported)"
                            style={{ minHeight: 140 }}
                        />

                        {/* Undo / Redo */}
                        <div className="absolute right-2 bottom-2 flex gap-1 z-10">
                            {[{
                                label: "Undo",
                                onClick: handleUndo,
                                disabled: contentUndoStack.length <= 1,
                                icon: <MdUndo size={12} />
                            }, {
                                label: "Redo",
                                onClick: handleRedo,
                                disabled: contentRedoStack.length === 0,
                                icon: <MdRedo size={12} />
                            }].map(({ label, onClick, disabled, icon }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={onClick}
                                    disabled={disabled}
                                    title={label}
                                    className="
                                        w-5 h-5
                                        flex items-center justify-center
                                        rounded-full
                                        border border-muted
                                        bg-white/70
                                        hover:bg-white
                                        shadow
                                        transition
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-type-2 mt-2 leading-relaxed">
                        <b>Markdown supported:</b> **bold**, *italic*, `inline code`,
                        ```code blocks```, lists, headings, blockquotes, and links.
                    </p>
                </div>

                {/* Markdown Upload */}
                <div
                    ref={dropRef}
                    className={`
                        border
                        rounded-lg
                        p-5
                        flex flex-col
                        items-center
                        justify-center
                        cursor-pointer
                        transition
                        glass-panel
                        ${isDragActive
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-muted hover:bg-white/10"}
                    `}
                    style={{ minHeight: 90 }}
                >
                    <label className="flex flex-col items-center gap-1 cursor-pointer text-type-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-type-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                            />
                        </svg>

                        <span className="text-sm">
                            {isDragActive
                                ? "Drop your .md file here"
                                : "Upload or drag & drop a .md file"}
                        </span>

                        <input
                            type="file"
                            accept=".md"
                            onChange={handleMdUpload}
                            className="hidden"
                        />
                    </label>

                    <span className="text-xs text-type-3 mt-2 text-center">
                        Markdown file will auto-fill title and content.
                    </span>
                </div>

                {/* Category + Type */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-type-2 font-mono mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Work, Personal"
                            className={textAreaStyle}
                            value={preselectedCategory ? preselectedCategory.name : category}
                            disabled={!!preselectedCategory}
                            onChange={
                                preselectedCategory ? undefined : (e) => setCategory(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-type-2 font-mono mb-2">
                            Category Type
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., ML, WebDev"
                            className={textAreaStyle}
                            value={
                                preselectedCategory?.type ?? categoryType
                            }
                            disabled={!!preselectedCategory?.type}
                            onChange={
                                preselectedCategory?.type
                                    ? undefined
                                    : (e) => setCategoryType(e.target.value)
                            }
                            pattern="^\\w+$"
                        />
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-type-2 font-mono mb-2">
                        Tags
                    </label>
                    <TagInput
                        value={tags}
                        onChange={setTags}
                        textAreaStyle={textAreaStyle}
                        placeholder="Add tags (Enter or comma)"
                    />
                    <p className="text-xs text-type-2 mt-1">
                        Max 30 characters per tag.
                    </p>
                </div>

                {/* Errors */}
                {formError && (
                    <div className="text-red-500 font-mono text-center">
                        {formError}
                    </div>
                )}

                {success && (
                    <div className="text-green-600 font-mono text-center">
                        Note created! Redirecting…
                    </div>
                )}

                {/* Submit */}
                <div className="flex justify-center w-full ">
                    <DottedButton
                    text="Create Note"
                    className="w-fit text-lg"
                    onClick={handleSubmit}
                />
                </div>
                
            </form>
        </div>

    );
};

export default CreateNote;

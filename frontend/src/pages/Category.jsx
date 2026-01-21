import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Author from "../components/Author";
import ConfirmPopUp from "../components/ConfirmPopUp";
import Loading from "../components/home/Loading";
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import DottedButton2 from "../components/buttons/DottedButton2";

const backdropStyle = {
    backdropFilter: 'blur(2px)',
    backdropShadow: '20px',
    background: 'rgba(255, 255, 255, 0.01)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
};

const Category = () => {
    const { user: loggedInUser } = useAuth();
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
    const [editMode, setEditMode] = useState(false);
    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState("");
    const [saving, setSaving] = useState(false);

    // For drag-and-drop
    const dropRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const handleNoteClick = (noteId) => {
        navigate(`/note/${noteId}`);
    };
    const handleUserClick = (userId) => {
        if (loggedInUser && userId === loggedInUser._id) {
            navigate("/profile/MyProfile");
        } else {
            navigate(`/profile/${userId}`);
        }
    };

    const handleCreateNote = () => {
        navigate("/CreateNote", { state: { category } });
    };

    // Client-side ZIP download of all notes as .md files
    const handleDownloadAllMidi = async () => {
        try {
            const zip = new JSZip();
            const folder = zip.folder((category?.name || "category").replace(/\s+/g, "_") || "category");
            (notes || []).forEach((n) => {
                const filename = `${String(n.title || "note").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "").slice(0,128) || "note"}.md`;
                folder.file(filename, String(n.content || ""));
            });
            const blob = await zip.generateAsync({ type: "blob" });
            const zipName = `${String(category?.name || "category").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "").slice(0,128) || "category"}.zip`;
            saveAs(blob, zipName);
        } catch (_) {}
    };

    // Handle .md file upload: for each file, create note directly and update list
    // Multi-file upload queue using localStorage, uploads one after another
    const UPLOAD_QUEUE_KEY = "mdUploadQueue";

    // Helper: get queue from localStorage
    function getUploadQueue() {
        try {
            const q = localStorage.getItem(UPLOAD_QUEUE_KEY);
            return q ? JSON.parse(q) : [];
        } catch {
            return [];
        }
    }
    // Helper: set queue in localStorage
    function setUploadQueue(queue) {
        localStorage.setItem(UPLOAD_QUEUE_KEY, JSON.stringify(queue));
    }
    // Helper: clear queue
    function clearUploadQueue() {
        localStorage.removeItem(UPLOAD_QUEUE_KEY);
    }

    // Main upload handler
    // --- handleUpload with improved duplicate toast and 5s countdown toast between uploads ---
    const handleUpload = async (e, filesOverride) => {
        let files = filesOverride || Array.from(e.target.files);
        if (!files.length) return;

        // Add files to queue in localStorage (as File cannot be stored, we store name+content)
        // Read all files as text, then push to queue
        const readFilesAsText = (filesArr) =>
            Promise.all(
                filesArr.map(
                    (file) =>
                        new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                resolve({
                                    name: file.name,
                                    content: reader.result,
                                });
                            };
                            reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
                            reader.readAsText(file);
                        })
                )
            );

        try {
            const filesData = await readFilesAsText(files);
            // Add to queue, but skip files with duplicate names already in queue for this category
            let queue = getUploadQueue();
            const existingNames = new Set(queue.filter(q => q.categoryId === categoryId).map(q => q.name));
            let addedAny = false;
            let duplicateFiles = [];
            filesData.forEach((f) => {
                if (existingNames.has(f.name)) {
                    duplicateFiles.push(f.name);
                } else {
                    queue.push({
                        name: f.name,
                        content: f.content,
                        categoryId,
                    });
                    existingNames.add(f.name);
                    addedAny = true;
                }
            });
            setUploadQueue(queue);

            // Show info toast for duplicates (if any)
            if (duplicateFiles.length > 0) {
                duplicateFiles.forEach(name => {
                    toast.info(`File "${name}" is already in the upload queue and was ignored.`, { autoClose: 4000 });
                });
            }

            // Start processing queue if not already running
            if (addedAny && !window.__mdUploadProcessing) {
                processUploadQueue();
            }
        } catch (err) {
            toast.error(err.message || "Failed to read files.");
        }

        // Clear the input value so the same file can be uploaded again
        if (e && e.target) e.target.value = "";
    };

    // --- processUploadQueue with 5s countdown toast ---
    async function processUploadQueue() {
        window.__mdUploadProcessing = true;
        let queue = getUploadQueue();
        if (!queue.length) {
            window.__mdUploadProcessing = false;
            clearUploadQueue();
            return;
        }
        const { name, content, categoryId: catId } = queue[0];
        const title = name.replace(/\.md$/i, "");

        // Show a 5 second countdown toast before uploading
        let countdown = 5;
        let toastId = toast.info(`Uploading "${title}" in ${countdown} seconds...`, {
            autoClose: false,
            closeButton: false,
            toastId: `countdown-${title}-${Date.now()}`
        });

        // Update the toast every second
        const interval = setInterval(() => {
            countdown -= 1;
            if (countdown > 0) {
                toast.update(toastId, {
                    render: `Uploading "${title}" in ${countdown} second${countdown === 1 ? "" : "s"}...`
                });
            }
        }, 1000);

        // Wait 5 seconds before uploading
        await new Promise(resolve => setTimeout(resolve, 5000));
        clearInterval(interval);
        toast.dismiss(toastId);

        try {
            const res = await axiosInstance.post("/api/notes", {
                title,
                content,
                category: catId,
            });
            toast.success(`Note "${title}" created!`);
            // If in correct category, update notes list
            if (
                res.data.category === catId ||
                (typeof res.data.category === "object" && res.data.category._id === catId)
            ) {
                // Use setNotes if available in closure
                if (typeof setNotes === "function") {
                    setNotes((prevNotes) => {
                        const newNotes = [...prevNotes, res.data];
                        return newNotes.slice().sort((a, b) =>
                            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
                        );
                    });
                }
            } else {
                toast.error("Note was not created in this category.");
            }
        } catch (err) {
            // If the error is about duplicate title, show a more specific message
            const errorMsg = err?.response?.data?.error || `Failed to create note: ${title}`;
            if (
                errorMsg &&
                errorMsg.toLowerCase().includes("note titles must be unique")
            ) {
                toast.error(
                    `A note with the title "${title}" already exists in this category. Note titles must be unique.`,
                    { autoClose: 6000 }
                );
            } else {
                toast.error(errorMsg);
            }
        }
        // Remove first from queue and continue
        queue = getUploadQueue();
        queue.shift();
        setUploadQueue(queue);
        setTimeout(processUploadQueue, 500);
    }

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.md'));
        if (files.length > 0) {
            handleUpload({ target: { value: "" } }, files);
        }
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

    const handleEditClick = () => {
        setEditMode(true);
        setEditName(category.name);
        setEditType(category.type || "");
    };
    const handleEditCancel = () => {
        setEditMode(false);
        setEditName(category.name);
        setEditType(category.type || "");
    };
    const handleEditSave = async () => {
        setSaving(true);
        try {
            const response = await axiosInstance.put(`/api/categories/${category._id}`, { name: editName, type: editType });
            setCategory({ ...category, name: response.data.name, type: response.data.type });
            setEditMode(false);
            toast.success("Category updated!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update category");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get(`/api/categories/${categoryId}`);
                setCategory(res.data);
                // Sort notes by title (case-insensitive)
                const sortedNotes = (res.data.notes || []).slice().sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
                setNotes(sortedNotes);
                setUser(res.data.user);
                setProfile(res.data.user);
                setEditName(res.data.name);
                setEditType(res.data.type || "");
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
           
                <div
                    ref={dropRef}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`container mx-auto p-6 max-w-3xl shadow-2xl border-1 border-dashed border-black mt-10 mb-2 relative w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl ${dragActive ? "ring-4 ring-indigo-300 bg-indigo-50" : ""}`}
                    style={{
                        ...backdropStyle,
                        borderTopLeftRadius: '60px',
                        borderTopRightRadius: '60px',
                        borderBottomLeftRadius: '0px',
                        borderBottomRightRadius: '0px',
                        transition: "background 0.2s, box-shadow 0.2s"
                    }}
                >
                    <Author user={user} handleUserClick={handleUserClick} />

                    {/* Category Header */}
                    <div className="flex items-center justify-center gap-6 mb-2">
                        <div className="flex flex-col items-center ">
                            <div
                                className="text-xl sm:text-2xl md:text-2xl font-extrabold text-gray-900 flex flex-col items-center gap-2 rounded-xl px-3 py-2 mb-7 shadow-xl "
                            >
                                <p className="text-md font-extrabold text-gray-900 flex items-center gap-2">
                                    Category :
                                </p>
                                {editMode ? (
                                    <>
                                        <input
                                            type="text"
                                            className="border border-gray-700 rounded px-3 py-2 text-sm mb-1 text-xl border-dashed rounded-xl"
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            placeholder="Category Name"
                                        />
                                        <div className="flex flex-col items-center justify-center gap-2 w-full">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-sm font-semibold text-blsck tracking-wide my-auto">Type:</span>
                                                <input
                                                    type="text"
                                                    className="border border-gray-700 rounded px-3 py-2 text-sm border-dashed rounded-xl"
                                                    value={editType}
                                                    onChange={e => setEditType(e.target.value)}
                                                    placeholder="Type (single word)"
                                                    pattern="^\\w*$"
                                                />
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <div
                                                    className="text-black text-sm h-fit px-3 py-1 rounded-lg font-semibold shadow hover:bg-blue-400/20 transition border border-dashed border-black hover:cursor-pointer"
                                                    onClick={handleEditSave}
                                                    disabled={saving}
                                                    type="button"
                                                >Save</div>
                                                <div
                                                    className="text-black text-sm h-fit px-3 py-1 rounded-lg font-semibold border-1 shadow hover:bg-red-400/20 transition hover:cursor-pointer"
                                                    onClick={handleEditCancel}
                                                    disabled={saving}
                                                    type="button"
                                                >Cancel</div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg font-bold break-words text-center px-2 border-b-1 border-black rounded-sm  px-3 py-2" style={{ wordBreak: "break-all" }}>
                                            {category.name}
                                        </p>
                                        <div className="flex flex-col items-center justify-center gap-2 w-full">
                                            <div className="flex flex-row gap-2">
                                                <span className="text-sm font-semibold text-blsck tracking-wide my-auto">Type:</span>
                                                <span className="text-sm">
                                                    {category.type || <span className="italic text-gray-400">(none)</span>}
                                                </span>
                                            </div>

                                            <div className="flex flex-row mt-2 w-full">
                                                {isOwner && (
                                                    <>
                                                        <div
                                                            className="ml-0 p-1 rounded-full text-gray-400 hover:text-red-500 transition cursor-pointer"
                                                            onClick={() => setShowDeletePopup(true)}
                                                            type="button"
                                                            style={{ background: "none", border: "none", outline: "none" }}
                                                            title="Delete this category"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m5 0H4" />
                                                            </svg>
                                                        </div>
                                                        <div
                                                            className="mr-0 text-black text-sm h-fit px-3 py-1 rounded-lg font-semibold shadow hover:bg-blue-400/20 transition border border-dashed border-black hover:cursor-pointer m-auto"
                                                            onClick={handleEditClick}
                                                            type="button"
                                                        >Edit</div>
                                                        <div
                                                            className="ml-2 text-black text-sm h-fit px-3 py-1 rounded-lg font-semibold shadow hover:bg-green-400/20 transition border border-dashed border-black hover:cursor-pointer m-auto"
                                                            onClick={handleDownloadAllMidi}
                                                            type="button"
                                                            title="Download all notes in this category as a ZIP of MIDI files"
                                                        >Download All (ZIP)</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div
                                type="button"
                                onClick={handleCreateNote}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-none border border-dashed border-black bg-white  hover:bg-white/50 shadow transition cursor-pointer"
                            >
                                <span className="font-semibold text-indigo-700 text-base">
                                    Add a new Note
                                </span>
                            </div>
                            <div
                                ref={dropRef}
                                className={`transition border-2 border-dashed rounded-lg mt-2 p-4 flex flex-col items-center justify-center cursor-pointer bg-white/80 hover:bg-white/50 shadow
                                    ${dragActive ? "border-indigo-500 bg-indigo-50" : "border-black"}
                                `}
                                style={{
                                    outline: dragActive ? "2px solid #6366f1" : "none",
                                    minHeight: "80px",
                                    position: "relative"
                                }}
                                tabIndex={0}
                                aria-label="Upload or drag and drop a Markdown file"
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                                    </svg>
                                    <span>
                                        {dragActive
                                            ? "Drop your .md file here"
                                            : "Upload or drag & drop a .md file"}
                                    </span>
                                    <input
                                        type="file"
                                        accept=".md"
                                        multiple
                                        onChange={handleUpload}
                                        className="hidden"
                                        tabIndex={-1}
                                    />
                                </label>
                                <div className="text-xs text-gray-500 mt-1 text-center w-full">
                                    Upload or drag and drop a Markdown (.md) file to add as a note.
                                <div className="mt-2 text-xs text-blue-500 font-semibold text-center">
                                    Note: There will be a 5 second gap between each note.<br />
                                    Please keep your PC on and <span className="underline text-red-500">do not refresh</span> the page during the process.
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
     
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
                               
                                    <li key={note._id}>
                                        <DottedButton2
                                            style={{ fontSize: "12px" }}
                                            className="w-full text-left"
                                            onClick={() => handleNoteClick(note._id)}
                                            text={note.title}
                                            tags={note.tags}
                                        />
                                    </li>
                          
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 italic text-center">No notes in this category.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Category;

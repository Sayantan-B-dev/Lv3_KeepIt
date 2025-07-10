import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Loading from "../components/home/Loading";
import Author from "../components/Author";
import ConfirmPopUp from "../components/ConfirmPopUp";
import { toast } from "react-toastify";
import EncryptButton from "../components/buttons/EncryptButton";
import { marked } from "marked";
import DOMPurify from 'dompurify';
import { useAuth } from '../context/AuthContext';

const backdropStyle = {
  backdropFilter: 'blur(2px)',
  backdropShadow: '20px',
  background: 'rgba(255, 255, 255, 0.01)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
};


const Note = () => {
  const { user: loggedInUser } = useAuth();
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [category, setCategory] = useState(null);
  const [user, setUser] = useState(null);

  const [deleting, setDeleting] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editNote, setEditNote] = useState({ title: "", content: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // Track if content is too large for editing
  const [contentTooLarge, setContentTooLarge] = useState(false);

  const CONTENT_MAX_LENGTH = undefined;

  const handleUserClick = (userId) => {
    window.open(`/profile/${userId}`, "_blank", "noopener,noreferrer");
  };
  const handleCategoryClick = (categoryId) => {
    window.open(`/category/${categoryId}`, "_blank", "noopener,noreferrer");
  };

  const handleDeleteNote = async () => {
    setDeleting(true);
    setError(null);
    try {
      await axiosInstance.delete(`/api/notes/${noteId}`);
      toast.success("Note deleted successfully");
      setShowDeletePopup(false);
      navigate(`/category/${category?._id || note.category}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to delete note. Please try again later."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    // If the note is very large, optionally warn or block editing
    if (note.content && CONTENT_MAX_LENGTH && note.content.length > CONTENT_MAX_LENGTH) {
      setContentTooLarge(true);
      setEditMode(false);
      return;
    }
    setEditMode(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    setEditNote({ title: note.title, content: note.content });
    setContentTooLarge(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setUpdateError(null);
    setUpdateSuccess(null);
    setEditNote({ title: note.title, content: note.content });
    setContentTooLarge(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "content" && CONTENT_MAX_LENGTH && value.length > CONTENT_MAX_LENGTH) {
      setContentTooLarge(true);
      return;
    }
    setEditNote((prev) => ({ ...prev, [name]: value }));
    setContentTooLarge(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      // Optionally, check for content length before sending
      if (CONTENT_MAX_LENGTH && editNote.content.length > CONTENT_MAX_LENGTH) {
        setUpdateError(`Content is too long. Maximum allowed is ${CONTENT_MAX_LENGTH} characters.`);
        setUpdateLoading(false);
        return;
      }
      const res = await axiosInstance.put(`/api/notes/${noteId}/edit`, {
        title: editNote.title,
        content: editNote.content,
        category: note.category?._id || note.category
      });
      setNote((prev) => ({ ...prev, ...res.data }));
      setEditMode(false);
      setUpdateSuccess("Note updated successfully!");
      toast.success("Note updated successfully!");
    } catch (err) {
      // Try to extract the most specific error message
      let errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update note.";
      setUpdateError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/notes/${noteId}`);
        setNote(res.data);
        setEditNote({ title: res.data.title, content: res.data.content });

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
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!note) {
    return <div>Note not found.</div>;
  }

  // Determine if the logged-in user is the owner of the note
  const isOwner =
    loggedInUser &&
    note.user &&
    (loggedInUser._id === note.user._id || loggedInUser._id === note.user);

  return (
    <>
      <ConfirmPopUp
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteNote}
        loading={deleting}
        message="Are you sure you want to delete this note? This action cannot be undone."
        title="Delete Note"
        backdropStyle={backdropStyle}
      />
      <div
        className="container mx-auto p-6 md:p-10 max-w-3xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl border border-indigo-100 mt-10 mb-16 w-[90%] max-w-full md:max-w-[70%] lg:max-w-[70%] "
        style={{
          ...backdropStyle,
          borderRadius: '60px',
          border: '1px dashed black',
        }}
      >
        <Author user={user} handleUserClick={handleUserClick} />
        {/* Note Header */}
        <div className="flex items-center gap-6 mb-8  justify-center">
          <div className="relative flex flex-col  justify-center">
            <p className="text-sm font-extrabold text-gray-900 flex items-center gap-2 text-center justify-center">
              Title:
            </p>
            <div>
              {editMode ? (
                <input
                  type="text"
                  name="title"
                  value={editNote.title}
                  onChange={handleInputChange}
                  className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 border border-indigo-200 rounded px-2 py-1"
                  maxLength={100}
                  disabled={updateLoading}
                />
              ) : (
                <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 flex items-center text-center justify-center gap-2" style={{ wordBreak: "break-all" }}>
                  {note.title}
                </h3>
              )}
            </div>
            {/* Delete button for owner, like in Category */}
            <div className="flex gap-4 mt-3 text-base text-gray-600 font-medium">
              <span className="flex items-center gap-1 text-xs    ">
                <span className="text-xs text-gray-400">Created:</span>
                {new Date(note.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              {isOwner && !editMode && (
                <button
                  className="ml-4 p-1 rounded-full text-gray-400 hover:text-red-500 transition cursor-pointer"
                  onClick={() => setShowDeletePopup(true)}
                  disabled={deleting}
                  title="Delete this note"
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
        {/* Category */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <span className="block font-semibold text-gray-700">Category:</span>
          <DottedButton
            style={{ fontSize: "12px" }}
            onClick={() => handleCategoryClick(category._id)}
            text={category?.name || note.category}
          />
        </div>
        {isOwner && !editMode && (
          < div className="w-full text-center justify-center ">
            <div onClick={handleEdit} className="w-full">
              <EncryptButton />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <span>
                <b>Markdown supported:</b> You can use <b>**bold**</b>, <i>*italic*</i>, <code>`inline code`</code>, <code>```code blocks```</code>, lists, headings (<code>#</code>, <code>##</code>, etc.), blockquotes (<code>&gt; quote</code>), and more.<br />
                <b>Links:</b> Paste a full URL (e.g. <code>https://example.com</code>) or Use [TextToClick](Link) for shorter more user friendly view and it will be clickable when viewing the note.<br />
              </span>
            </div>
          </div>
        )}
        {/* Content */}
        <div className="my-8">
          <h2 className="font-semibold text-black mb-2 text-lg">Content : </h2>
          {editMode ? (
            <>
              {contentTooLarge && (
                <div className="mb-2 text-red-500 text-center">
                  {CONTENT_MAX_LENGTH
                    ? `Content is too long to edit (max ${CONTENT_MAX_LENGTH} characters).`
                    : "Content is too large to edit in this field."}
                </div>
              )}
              <textarea
                name="content"
                value={editNote.content}
                onChange={handleInputChange}
                className="w-full h-200 border border-indigo-200 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-300"
                rows={16}
                maxLength={CONTENT_MAX_LENGTH}
                disabled={updateLoading || contentTooLarge}
                style={contentTooLarge ? { background: "#fef2f2" } : {}}
              />
            </>
          ) : (
            <div
              className="bg-white/40 rounded-xl px-5 py-4 shadow-lg  border-1 border-black whitespace-pre-line text-gray-800"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  marked(note.content, {
                    highlight: function (code, lang) {
                      return code;
                    }
                  })
                )
                  // Style <a> tags and ensure long links break inside the box
                  .replace(
                    /<a /g,
                    '<a target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 500; word-break: break-all; overflow-wrap: anywhere;" '
                  )
                  // Style <pre> blocks
                  .replace(
                    /<pre>/g,
                    '<pre style="background: #23272e; color: #f8f8f2; padding: 1em; border-radius: 10px; margin: 1em 0; overflow-x: auto; font-size: 0.97em;">'
                  )
                  // Style <pre><code>
                  .replace(
                    /<pre[^>]*>\s*<code( class=".*?")?>/g,
                    '<pre style="background: #23272e; color: #f8f8f2; padding: 1em; border-radius: 10px; margin: 1em 0; overflow-x: auto; font-size: 0.97em;"><code style="background: transparent; color: inherit; padding: 0; border-radius: 0; font-size: inherit;">'
                  )
                  // Style <code>
                  .replace(
                    /<code( class=".*?")?>/g,
                    '<code style="background: #f3f4f6; color: #23272e; padding: 2px 6px; border-radius: 4px; font-size: 0.97em; border: 1px solid #e5e7eb;">'
                  )
                  // Style markdown tables - make them horizontally scrollable on small screens
                  .replace(
                    /<table>/g,
                    '<div style="overflow-x:auto; max-width:100vw;"><table style="min-width:400px; width:100%; border-collapse:collapse; margin:1.5em 0; font-size:0.98em; background:#f8fafc; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px 0 rgba(31,38,135,0.05);">'
                  )
                  .replace(
                    /<thead>/g,
                    '<thead style="background:#e0e7ef;">'
                  )
                  .replace(
                    /<th>/g,
                    '<th style="padding:10px 16px; border-bottom:2px solid #c7d2fe; font-weight:700; text-align:left; color:#1e293b;">'
                  )
                  .replace(
                    /<tr>/g,
                    '<tr style="border-bottom:1px solid #e5e7eb;">'
                  )
                  .replace(
                    /<td>/g,
                    '<td style="padding:10px 16px; border-bottom:1px solid #e5e7eb; color:#334155; vertical-align:top;">'
                  )
                  // Close the wrapping div after </table>
                  .replace(
                    /<\/table>/g,
                    '</table></div>'
                  )
              }}
            />
          )}
        </div>
        {/* Likes */}
        {/* <div className="flex items-center gap-2 mt-6">
            <span className="font-semibold text-gray-700">Likes:</span>
            <span className="text-indigo-600 font-bold">{note.likes ? note.likes.length : 0}</span>
          </div> */}

        {isOwner && editMode && (
          <div className="flex gap-3 mb-auto w-full justify-center">
            <button
              onClick={handleSave}
              className="text-black px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-400/20 transition border border-dashed border-black"
              disabled={updateLoading || contentTooLarge}
              style={{ border: "1px dashed black" }}
            >
              {updateLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="text-black px-6 py-2 rounded-lg font-semibold shadow hover:bg-red-400/20 transition"
              disabled={updateLoading}
              style={{ border: "1px dashed black" }}
            >
              Cancel
            </button>
          </div>
        )}
        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm italic">
            Viewing note <span className="font-bold">{note.title}</span>.
          </p>
        </div>

        {updateError && <div className="mt-2 text-red-500 text-center">{updateError}</div>}
        {updateSuccess && <div className="mt-2 text-green-600 text-center">{updateSuccess}</div>}
      </div>
    </>
  );
};

export default Note;
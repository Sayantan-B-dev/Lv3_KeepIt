import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton from "../components/buttons/DottedButton";
import Loading from "../components/home/Loading";
import Author from "../components/Author";
import ConfirmPopUp from "../components/ConfirmPopUp";
import { toast } from "react-toastify";
import EncryptButton from "../components/buttons/EncryptButton";


const backdropStyle = {
  backdropFilter: 'blur(2px)',
  backdropShadow: '20px',
  background: 'rgba(255, 255, 255, 0.01)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
};

function linkify(text) {
  if (!text) return '';
  const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue;">${displayUrl}</a>`;
  });
}

const Note = ({ user: loggedInUser }) => {
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

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleDeleteNote = async () => {
    setDeleting(true);
    setError(null);
    try {
      await axiosInstance.delete(`/api/notes/${noteId}`);
      toast.success("Note deleted successfully");
      setShowDeletePopup(false);
      navigate("/profile/MyProfile");
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
    setEditMode(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    setEditNote({ title: note.title, content: note.content });
  };

  const handleCancel = () => {
    setEditMode(false);
    setUpdateError(null);
    setUpdateSuccess(null);
    setEditNote({ title: note.title, content: note.content });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
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
          {/* Content */}
          <div className="mb-8">
            <h2 className="font-semibold text-black mb-2 text-lg">Content</h2>
            {editMode ? (
              <textarea
                name="content"
                value={editNote.content}
                onChange={handleInputChange}
                className="w-full h-40 border border-indigo-200 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-300"
                rows={8}
                maxLength={2000}
                disabled={updateLoading}
              />
            ) : (
              <div
                className="bg-white/80 rounded-xl px-5 py-4 shadow-sm border border-indigo-50 whitespace-pre-line text-gray-800"
                dangerouslySetInnerHTML={{ __html: linkify(note.content) }}
              />
            )}
          </div>
          {/* Likes */}
          {/* <div className="flex items-center gap-2 mt-6">
            <span className="font-semibold text-gray-700">Likes:</span>
            <span className="text-indigo-600 font-bold">{note.likes ? note.likes.length : 0}</span>
          </div> */}
          {isOwner && !editMode && (
            <button onClick={handleEdit} className="w-full">
              <EncryptButton />
            </button>
          )}
          {isOwner && editMode && (
            <div className="flex gap-3 mb-auto w-full justify-center">
              <button
                onClick={handleSave}
                className="text-black px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-400/20 transition border border-dashed border-black"
                disabled={updateLoading}
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

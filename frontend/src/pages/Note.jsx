import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DottedButton2 from "../components/buttons/DottedButton2";
import Loading from "../components/home/Loading";
import Author from "../components/Author";
import ConfirmPopUp from "../components/ConfirmPopUp";
import { toast } from "react-toastify";
import EncryptButton from "../components/buttons/EncryptButton";
import { marked } from "marked";
import DOMPurify from 'dompurify';
import { useAuth } from '../context/AuthContext';
import NoteHeader from "./notePageComponents/NoteHeader";
import NoteTags from "./notePageComponents/NoteTags";
import NoteContent from "./notePageComponents/NoteContent";
import NoteNavigation from "./notePageComponents/NoteNavigation";
import NoteFooter from "./notePageComponents/NoteFooter";

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
  const [categoryNotes, setCategoryNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [deleting, setDeleting] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editNote, setEditNote] = useState({ title: "", content: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // Track if content is too large for editing
  const [contentTooLarge, setContentTooLarge] = useState(false);

  const CONTENT_MAX_LENGTH = 20000;

  const [editTags, setEditTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const handleUserClick = (userId) => {
    if (loggedInUser && userId === loggedInUser._id) {
      navigate("/profile/MyProfile");
    } else {
      navigate(`/profile/${userId}`);
    }
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
    setEditTags(Array.isArray(note.tags) ? note.tags : []);
    setNewTag("");
    setContentTooLarge(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setUpdateError(null);
    setUpdateSuccess(null);
    setEditNote({ title: note.title, content: note.content });
    setContentTooLarge(false);
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !editTags.includes(tag)) {
      setEditTags([...editTags, tag]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "content" && CONTENT_MAX_LENGTH && value.length > CONTENT_MAX_LENGTH) {
      setContentTooLarge(true);
      return;
    }
    if (name === "newTag") {
      setNewTag(value);
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
        category: note.category?._id || note.category,
        tags: editTags,
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
        setEditTags(Array.isArray(res.data.tags) ? res.data.tags : []);

        const categoryRes = await axiosInstance.get(`/api/categories/${res.data.category}`);
        setCategory(categoryRes.data);
        // Fetch all notes in this category (sorted by title for consistency)
        const notesArr = (categoryRes.data.notes || []).slice().sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
        setCategoryNotes(notesArr);
        const idx = notesArr.findIndex(n => n._id === res.data._id);
        setCurrentIndex(idx);

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

  const goToNote = (idx) => {
    if (idx >= 0 && idx < categoryNotes.length) {
      navigate(`/note/${categoryNotes[idx]._id}`);
    }
  };

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
        <NoteHeader
          note={note}
          user={user}
          isOwner={isOwner}
          editMode={editMode}
          editNote={editNote}
          handleInputChange={handleInputChange}
          updateLoading={updateLoading}
          handleEdit={handleEdit}
          handleDelete={handleDeleteNote}
          deleting={deleting}
          setShowDeletePopup={setShowDeletePopup}
          showDeletePopup={showDeletePopup}
          contentTooLarge={contentTooLarge}
          category={category}
          handleCategoryClick={handleCategoryClick}
          EncryptButton={EncryptButton}
          newTag={newTag}
          handleAddTag={handleAddTag}
          editTags={editTags}
          handleRemoveTag={handleRemoveTag}
          setNewTag={setNewTag}
          updateError={updateError}
          updateSuccess={updateSuccess}
          handleCancel={handleCancel}
          handleSave={handleSave}
        />
        <NoteTags
          editMode={editMode}
          editTags={editTags}
          handleRemoveTag={handleRemoveTag}
          newTag={newTag}
          handleInputChange={handleInputChange}
          handleAddTag={handleAddTag}
          updateLoading={updateLoading}
          setNewTag={setNewTag}
          note={note}
          navigate={navigate}
        />
        <NoteNavigation
          currentIndex={currentIndex}
          categoryNotes={categoryNotes}
          goToNote={goToNote}
        />
        {isOwner && !editMode && (
          <div className="w-full text-center justify-center ">
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
        <NoteContent
          editMode={editMode}
          editNote={editNote}
          handleInputChange={handleInputChange}
          updateLoading={updateLoading}
          contentTooLarge={contentTooLarge}
          CONTENT_MAX_LENGTH={CONTENT_MAX_LENGTH}
          note={note}
        />
        <NoteFooter
          note={note}
          updateError={updateError}
          updateSuccess={updateSuccess}
        />
      </div>
    </>
  );
};

export default Note;
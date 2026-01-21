import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

import Loading from "../components/home/Loading";
import Author from "../components/Author";
import ConfirmPopUp from "../components/ConfirmPopUp";
import EncryptButton from "../components/buttons/EncryptButton";

import NoteHeader from "./notePageComponents/NoteHeader";
import NoteTags from "./notePageComponents/NoteTags";
import NoteContent from "./notePageComponents/NoteContent";
import NoteNavigation from "./notePageComponents/NoteNavigation";
import NoteFooter from "./notePageComponents/NoteFooter";

const backdropStyle = {
  backdropFilter: "blur(2px)",
  background: "rgba(255, 255, 255, 0.01)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 4px 32px 0 rgba(31, 38, 135, 0.10)",
};

const CONTENT_MAX_LENGTH = 50000;

const Note = () => {
  const { user: loggedInUser } = useAuth();
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [category, setCategory] = useState(null);
  const [user, setUser] = useState(null);

  const [categoryNotes, setCategoryNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editNote, setEditNote] = useState({ title: "", content: "" });
  const [editTags, setEditTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const [contentTooLarge, setContentTooLarge] = useState(false);

  /* ---------------- Navigation helpers ---------------- */

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

  const goToNote = (idx) => {
    if (idx >= 0 && idx < categoryNotes.length) {
      navigate(`/note/${categoryNotes[idx]._id}`);
    }
  };

  /* ---------------- CRUD ---------------- */

  const handleDeleteNote = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/notes/${noteId}`);
      toast.success("Note deleted successfully");
      navigate(`/category/${category?._id || note.category}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete note."
      );
    } finally {
      setDeleting(false);
      setShowDeletePopup(false);
    }
  };

  const handleEdit = () => {
    if (
      note.content &&
      CONTENT_MAX_LENGTH &&
      note.content.length > CONTENT_MAX_LENGTH
    ) {
      setContentTooLarge(true);
      return;
    }

    setEditMode(true);
    setEditNote({ title: note.title, content: note.content });
    setEditTags(Array.isArray(note.tags) ? note.tags : []);
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setContentTooLarge(false);
    setEditNote({ title: note.title, content: note.content });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "content" &&
      CONTENT_MAX_LENGTH &&
      value.length > CONTENT_MAX_LENGTH
    ) {
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

    try {
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
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to update note.";
      setUpdateError(msg);
      toast.error(msg);
    } finally {
      setUpdateLoading(false);
    }
  };

  /* ---------------- Data fetch ---------------- */

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      setError(null);

      try {
        const noteRes = await axiosInstance.get(`/api/notes/${noteId}`);
        setNote(noteRes.data);
        setEditNote({
          title: noteRes.data.title,
          content: noteRes.data.content,
        });
        setEditTags(noteRes.data.tags || []);

        const categoryRes = await axiosInstance.get(
          `/api/categories/${noteRes.data.category}`
        );
        setCategory(categoryRes.data);

        const sortedNotes = (categoryRes.data.notes || []).slice().sort(
          (a, b) =>
            a.title.localeCompare(b.title, undefined, {
              sensitivity: "base",
            })
        );
        setCategoryNotes(sortedNotes);
        setCurrentIndex(
          sortedNotes.findIndex((n) => n._id === noteRes.data._id)
        );

        const userRes = await axiosInstance.get(
          `/api/profile/${noteRes.data.user}`
        );
        setUser(userRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load note."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  /* ---------------- Guards ---------------- */

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!note) return <div>Note not found.</div>;

  const isOwner =
    loggedInUser &&
    note.user &&
    (loggedInUser._id === note.user._id ||
      loggedInUser._id === note.user);

  /* ---------------- Render ---------------- */

  return (
    <>
      <ConfirmPopUp
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteNote}
        loading={deleting}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        backdropStyle={backdropStyle}
      />

      <div
        className="container mx-auto p-6 md:p-10 max-w-3xl shadow-2xl border border-dashed border-black mt-10 mb-16 w-[90%]"
        style={{ ...backdropStyle, borderRadius: "60px" }}
      >
        <Author user={user} handleUserClick={handleUserClick} />

        <NoteHeader
          note={note}
          user={user}
          category={category}
          isOwner={isOwner}
          editMode={editMode}
          editNote={editNote}
          updateLoading={updateLoading}
          updateError={updateError}
          updateSuccess={updateSuccess}
          contentTooLarge={contentTooLarge}
          handleInputChange={handleInputChange}
          handleEdit={handleEdit}
          handleCancel={handleCancel}
          handleSave={handleSave}
          handleDelete={() => setShowDeletePopup(true)}
          handleCategoryClick={handleCategoryClick}
          EncryptButton={EncryptButton}
        />

        <NoteTags
          editMode={editMode}
          editTags={editTags}
          newTag={newTag}
          setNewTag={setNewTag}
          handleInputChange={handleInputChange}
          handleAddTag={() => {
            const t = newTag.trim();
            if (t && !editTags.includes(t)) {
              setEditTags([...editTags, t]);
            }
            setNewTag("");
          }}
          handleRemoveTag={(tag) =>
            setEditTags(editTags.filter((t) => t !== tag))
          }
          note={note}
          navigate={navigate}
        />

        <NoteNavigation
          currentIndex={currentIndex}
          categoryNotes={categoryNotes}
          goToNote={goToNote}
        />

        {!editMode && isOwner && (
          <div className="text-center">
            <EncryptButton onClick={handleEdit} />
          </div>
        )}

        <NoteContent
          editMode={editMode}
          editNote={editNote}
          note={note}
          updateLoading={updateLoading}
          contentTooLarge={contentTooLarge}
          CONTENT_MAX_LENGTH={CONTENT_MAX_LENGTH}
          handleInputChange={handleInputChange}
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

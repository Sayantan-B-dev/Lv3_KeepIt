import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
;
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
;

import { Loading } from "@/features/home";
import { ConfirmPopUp } from "@/components/ui";
import {
  NoteHeader,
  NoteContent,
  NoteNavigation,
  NoteFooter
} from "@/features/notes";
import { noteCache } from "@/utils/noteCache";

const CONTENT_MAX_LENGTH = 100000;

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

  const goToNote = async (idx) => {
    if (idx < 0 || idx >= categoryNotes.length) return;

    const targetId = categoryNotes[idx]._id;

    const cached = noteCache.get(targetId);
    if (cached) {
      setNote(cached);
      setCurrentIndex(idx);
      navigate(`/note/${targetId}`, { replace: true });
      return;
    }

    navigate(`/note/${targetId}`);
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

  const handleAddTag = () => {
    const t = newTag.trim();
    if (t && !editTags.includes(t)) {
      setEditTags([...editTags, t]);
    }
    setNewTag("");
  }
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
    let cancelled = false;

    const run = async () => {
      const cached = noteCache.get(noteId);

      if (cached) {
        setNote(cached);
        setEditNote({ title: cached.title, content: cached.content });
        setEditTags(cached.tags || []);
      }

      try {
        const noteData = cached
          ? cached
          : (await axiosInstance.get(`/api/notes/${noteId}`)).data;

        if (!cached) {
          noteCache.set(noteId, noteData);
          setNote(noteData);
          setEditNote({ title: noteData.title, content: noteData.content });
          setEditTags(noteData.tags || []);
        }

        const [categoryRes, userRes] = await Promise.all([
          axiosInstance.get(`/api/categories/${noteData.category}`),
          axiosInstance.get(`/api/profile/${noteData.user}`),
        ]);

        if (cancelled) return;

        setCategory(categoryRes.data);
        setUser(userRes.data);

        const sortedNotes = (categoryRes.data.notes || [])
          .slice()
          .sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          );

        setCategoryNotes(sortedNotes);
        setCurrentIndex(
          sortedNotes.findIndex((n) => n._id === noteData._id)
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Failed to load note."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    setLoading(true);
    setError(null);
    run();

    return () => {
      cancelled = true;
    };
  }, [noteId]);

  /* ---------------- Prefetching ---------------- */
  useEffect(() => {
    if (!categoryNotes.length || currentIndex === -1) return;

    const PREFETCH_RANGE = 3;

    const idsToPrefetch = [];

    for (let offset = 1; offset <= PREFETCH_RANGE; offset++) {
      const prev = categoryNotes[currentIndex - offset];
      const next = categoryNotes[currentIndex + offset];

      if (prev) idsToPrefetch.push(prev._id);
      if (next) idsToPrefetch.push(next._id);
    }

    idsToPrefetch.forEach(async (id) => {
      if (noteCache.has(id)) return;

      try {
        const res = await axiosInstance.get(`/api/notes/${id}`);
        noteCache.set(id, res.data);
      } catch {
        // ignore failures, do not block UI
      }
    });
  }, [currentIndex, categoryNotes]);
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
      />

      <div
        className="w-full"
      >


        <NoteHeader
          note={note}
          user={user}
          category={category}
          isOwner={isOwner}
          editMode={editMode}
          editNote={editNote}
          editTags={editTags}
          newTag={newTag}
          setNewTag={setNewTag}
          updateLoading={updateLoading}
          contentTooLarge={contentTooLarge}
          handleInputChange={handleInputChange}
          handleEdit={handleEdit}
          handleCancel={handleCancel}
          handleSave={handleSave}
          handleDelete={() => setShowDeletePopup(true)}
          handleCategoryClick={handleCategoryClick}
          handleAddTag={handleAddTag}
          handleRemoveTag={(tag) =>
            setEditTags(editTags.filter((t) => t !== tag))
          }
          isAuthenticated={!!loggedInUser}
          onUserClick={handleUserClick}
          navigate={navigate}
        />


        <NoteNavigation
          currentIndex={currentIndex}
          categoryNotes={categoryNotes}
          goToNote={goToNote}
        />



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

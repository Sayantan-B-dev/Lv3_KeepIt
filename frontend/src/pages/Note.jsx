import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

import { Loading } from "@/features/home";
import { ConfirmPopUp } from "@/components/ui";
import {
  NoteHeader,
  NoteContent,
  NoteNavigation,
  NoteFooter,
  AccessDenied
} from "@/features/notes";
import { noteCache } from "@/utils/noteCache";
import { exportCategoryAsZip } from "@/utils/exportCategoryAsZip";
import DownloadProgress from "@/features/category/DownloadProgress";

const CONTENT_MAX_LENGTH = 100000;

const Note = () => {
  const { user: loggedInUser } = useAuth();
  const { noteId } = useParams();
  const navigate = useNavigate();

  const activeNoteIdRef = useRef(noteId);

  const [note, setNote] = useState(null);
  const [category, setCategory] = useState(null);
  const [user, setUser] = useState(null);

  const [categoryNotes, setCategoryNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmStep, setConfirmStep] = useState(1);

  const [exportState, setExportState] = useState({
    isExporting: false,
    progress: 0,
    currentTitle: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [editNote, setEditNote] = useState({ title: "", content: "" });
  const [editTags, setEditTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const [contentTooLarge, setContentTooLarge] = useState(false);

  /* ---------------- Navigation helpers ---------------- */

  useEffect(() => {
    activeNoteIdRef.current = noteId;
  }, [noteId]);

  const goToNote = (idx) => {
    if (idx < 0 || idx >= categoryNotes.length) return;
    navigate(`/note/${categoryNotes[idx]._id}`);
  };

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

  /* ---------------- CRUD ---------------- */

  const handleDeleteNote = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/notes/${noteId}`);
      toast.success("Note deleted successfully");
      navigate(`/category/${category?._id || note.category}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete note."
      );
    } finally {
      setDeleting(false);
      setShowDeletePopup(false);
      setConfirmStep(1);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmStep === 1) {
      setConfirmStep(2);
      return;
    }
    handleDeleteNote();
  };

  /* ---------------- Edit ---------------- */

  const handleEdit = () => {
    if (note.content?.length > CONTENT_MAX_LENGTH) {
      setContentTooLarge(true);
      return;
    }
    setEditMode(true);
    setEditNote({ title: note.title, content: note.content, isPrivate: note.isPrivate });
    setEditTags(note.tags || []);
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handleCancel = () => {
    setEditMode(false);
    setContentTooLarge(false);
    setEditNote({ title: note.title, content: note.content, isPrivate: note.isPrivate });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "content" && value.length > CONTENT_MAX_LENGTH) {
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
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const res = await axiosInstance.put(`/api/notes/${noteId}`, {
        title: editNote.title,
        content: editNote.content,
        category: note.category?._id || note.category,
        tags: editTags,
        isPrivate: editNote.isPrivate,
      });

      setNote((prev) => ({ ...prev, ...res.data }));
      noteCache.set(noteId, res.data);
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

  const handleDownloadNote = async () => {
    if (!note) return;

    setExportState({ isExporting: true, progress: 0, currentTitle: "Preparing download..." });

    try {
      // Re-use export utility for single note
      await exportCategoryAsZip(
        { name: note.title },
        [note],
        ({ progress, title }) => {
          setExportState(prev => ({
            ...prev,
            progress: progress,
            currentTitle: title
          }));
        }
      );

      // Delay so user actually sees the 100% bar
      await new Promise(resolve => setTimeout(resolve, 800));

      toast.success("Note exported successfully!");
    } catch (err) {
      toast.error("Failed to export note.");
    } finally {
      setExportState({ isExporting: false, progress: 0, currentTitle: "" });
    }
  };

  /* ---------------- Data fetch ---------------- */

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const cached = noteCache.get(noteId);
        const noteData = cached
          ? cached
          : (await axiosInstance.get(`/api/notes/${noteId}`)).data;

        noteCache.set(noteId, noteData);
        setNote(noteData);
        setEditNote({ title: noteData.title, content: noteData.content, isPrivate: noteData.isPrivate });
        setEditTags(noteData.tags || []);

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
            err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to load note."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [noteId]);

  /* ---------------- Prefetching (GUARDED) ---------------- */

  useEffect(() => {
    if (!categoryNotes.length || currentIndex === -1) return;

    const PREFETCH_RANGE = 3;
    const baseNoteId = activeNoteIdRef.current;

    const idsToPrefetch = [];

    for (let i = 1; i <= PREFETCH_RANGE; i++) {
      const prev = categoryNotes[currentIndex - i];
      const next = categoryNotes[currentIndex + i];
      if (prev) idsToPrefetch.push(prev._id);
      if (next) idsToPrefetch.push(next._id);
    }

    idsToPrefetch.forEach(async (id) => {
      if (noteCache.has(id)) return;

      try {
        const res = await axiosInstance.get(`/api/notes/${id}`);

        if (activeNoteIdRef.current !== baseNoteId) return;

        noteCache.set(id, res.data);
      } catch {
        // ignore
      }
    });
  }, [currentIndex, categoryNotes]);

  /* ---------------- Guards ---------------- */

  if (loading) return <Loading />;

  if (error) {
    return <AccessDenied error={error} />;
  }

  if (!note) return (
    <div className="text-center p-20 font-mono text-type-3">
      Note not found.
    </div>
  );

  const isOwner =
    loggedInUser &&
    (loggedInUser._id === note.user?._id || loggedInUser._id === note.user);

  /* ---------------- Render ---------------- */

  return (
    <>
      <ConfirmPopUp
        open={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setConfirmStep(1);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        message={
          confirmStep === 1
            ? "Are you sure you want to delete this note?"
            : "FINAL WARNING: This will permanently delete note. This action CANNOT be undone."
        }
      />

      <div className="w-full pb-32 relative">
        <NoteNavigation
          currentIndex={currentIndex}
          categoryNotes={categoryNotes}
          goToNote={goToNote}
        />

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
          onDownloadNote={handleDownloadNote}
        />

        <DownloadProgress
          isExporting={exportState.isExporting}
          progress={exportState.progress}
          currentTitle={exportState.currentTitle}
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

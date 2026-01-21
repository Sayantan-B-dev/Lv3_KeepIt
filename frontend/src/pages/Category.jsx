import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

import Loading from "../components/home/Loading";
import ConfirmPopUp from "../components/ConfirmPopUp";

import CategoryHeader from "../components/category/CategoryHeader";
import CategoryNotesList from "../components/category/CategoryNotesList";
import MarkdownUploadBox from "../components/category/MarkdownUploadBox";

import useMarkdownUploadQueue from "../hooks/useMarkdownUploadQueue";
import useDragAndDrop from "../hooks/useDragAndDrop";
import { exportCategoryAsZip } from "../utils/exportCategoryAsZip";

const backdropStyle = {
  backdropFilter: "blur(2px)",
  background: "rgba(255, 255, 255, 0.01)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 4px 32px 0 rgba(31, 38, 135, 0.10)",
};

const Category = () => {
  const { user: loggedInUser } = useAuth();
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [saving, setSaving] = useState(false);

  /* ---------------- Upload + Drag & Drop ---------------- */

  const { handleUpload } = useMarkdownUploadQueue(categoryId, setNotes);

  const { dragActive, handlers: dragHandlers } = useDragAndDrop({
    onFilesDrop: (files) =>
      handleUpload({ target: { value: "" } }, files),
    fileFilter: (f) => f.name.endsWith(".md"),
  });

  /* ---------------- Data Fetch ---------------- */

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/categories/${categoryId}`);
        const sortedNotes = (res.data.notes || []).slice().sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );

        setCategory(res.data);
        setNotes(sortedNotes);
        setUser(res.data.user);
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

  /* ---------------- Actions ---------------- */

  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const handleCreateNote = () => {
    navigate("/CreateNote", { state: { category } });
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.put(
        `/api/categories/${category._id}`,
        { name: editName, type: editType }
      );
      setCategory({ ...category, name: res.data.name, type: res.data.type });
      setEditMode(false);
      toast.success("Category updated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    setDeleting(true);
    try {
      if (notes.length > 0) {
        await Promise.all(
          notes.map((n) => axiosInstance.delete(`/api/notes/${n._id}`))
        );
      }
      await axiosInstance.delete(`/api/categories/${categoryId}`);
      toast.success("Category deleted");
      navigate("/profile/MyProfile");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete category and notes"
      );
    } finally {
      setDeleting(false);
      setShowDeletePopup(false);
    }
  };

  /* ---------------- Guards ---------------- */

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!category) return <div>Category not found.</div>;

  const isOwner =
    loggedInUser &&
    category.user &&
    (loggedInUser._id === category.user._id ||
      loggedInUser._id === category.user);

  /* ---------------- Render ---------------- */

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

      <CategoryHeader
        category={category}
        user={user}
        isOwner={isOwner}
        editMode={editMode}
        editName={editName}
        editType={editType}
        saving={saving}
        dragActive={dragActive}
        dragHandlers={dragHandlers}
        onEditNameChange={(e) => setEditName(e.target.value)}
        onEditTypeChange={(e) => setEditType(e.target.value)}
        onEditSave={handleEditSave}
        onEditCancel={() => setEditMode(false)}
        onEditClick={() => setEditMode(true)}
        onDeleteClick={() => setShowDeletePopup(true)}
        onDownloadAll={() => exportCategoryAsZip(category, notes)}
        onCreateNote={handleCreateNote}
        isAuthenticated={!!loggedInUser}
      />

      <div
        className="mb-8 container mx-auto p-6 md:p-10 shadow-xl border border-muted w-full rounded-b-lg"
      >
        <MarkdownUploadBox
          dragActive={dragActive}
          dragHandlers={dragHandlers}
          onFileSelect={handleUpload}
        />

        <CategoryNotesList
          notes={notes}
          onNoteClick={handleNoteClick}
        />
      </div>
    </>
  );
};

export default Category;

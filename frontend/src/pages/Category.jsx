import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

import { Loading } from "@/features/home";
import { ConfirmPopUp } from "@/components/ui";

import CategoryHeader from "@/features/category/CategoryHeader";
import CategoryNotesList from "@/features/category/CategoryNotesList";
import MarkdownUploadBox from "@/features/category/MarkdownUploadBox";

import useMarkdownUploadQueue from "@/hooks/useMarkdownUploadQueue";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { exportCategoryAsZip } from "@/utils/exportCategoryAsZip";



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



    /* ---------------- Navigation helpers ---------------- */
    const handleUserClick = (userId) => {
      if (loggedInUser && userId === loggedInUser._id) {
        navigate("/profile/MyProfile");
      } else {
        navigate(`/profile/${userId}`);
      } 
    };
    /* ---------------- Upload + Drag & Drop ---------------- */

    const { handleUpload } = useMarkdownUploadQueue(categoryId, setNotes);

    const { dragActive, handlers: dragHandlers } = useDragAndDrop({
      onFilesDrop: (files) =>
        handleUpload({ target: { value: "" } }, files),
      fileFilter: (f) => f.name.endsWith(".md"),
    });

    /* ---------------- Data Fetch ---------------- */

 useEffect(() => {
  const fetchCategoryAndNotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoryRes, notesRes] = await Promise.all([
        axiosInstance.get(`/api/categories/${categoryId}`),
        axiosInstance.get(`/api/notes/category/${categoryId}`, {
          params: { page: 1, limit: 100 } // adjust later
        })
      ]);

      setCategory(categoryRes.data);
      setUser(categoryRes.data.user);
      setEditName(categoryRes.data.name);
      setEditType(categoryRes.data.type || "");

      const sortedNotes = (notesRes.data.notes || []).sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );

      setNotes(sortedNotes);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to load category."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchCategoryAndNotes();
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
      <div className="w-full">
        <ConfirmPopUp
          open={showDeletePopup}
          onClose={() => setShowDeletePopup(false)}
          onConfirm={handleDeleteCategory}
          loading={deleting}
          message="Are you sure you want to delete this category? This will also delete all notes in this category. This action cannot be undone."
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
          onUserClick={handleUserClick}
        />


        <div
          className="mb-8 mx-auto w-full md:p-10 shadow-xl border border-muted rounded-b-lg"
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
      </div>
    );
  };

  export default Category;

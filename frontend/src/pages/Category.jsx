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
import UploadQueueDisplay from "@/features/category/UploadQueueDisplay";
import DownloadProgress from "@/features/category/DownloadProgress";

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
  const [confirmStep, setConfirmStep] = useState(1); // 👈 step 1 or 2

  const [exportState, setExportState] = useState({
    isExporting: false,
    progress: 0,
    currentTitle: ""
  });



  /* ---------------- Navigation helpers ---------------- */
  const handleUserClick = (userId) => {
    if (loggedInUser && userId === loggedInUser._id) {
      navigate("/profile/MyProfile");
    } else {
      navigate(`/profile/${userId}`);
    }
  };
  /* ---------------- Upload + Drag & Drop ---------------- */

  const { handleUpload, getUploadQueue, clearUploadQueue, resumeQueue } = useMarkdownUploadQueue(categoryId, setNotes);

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
        // 1️⃣ Always fetch PUBLIC category
        const categoryRes = await axiosInstance.get(
          `/api/categories/${categoryId}/public`
        );

        const categoryData = categoryRes.data;
        setCategory(categoryData);
        setUser(categoryData.user);
        setEditName(categoryData.name);
        setEditType(categoryData.type || "");

        // 2️⃣ Detect ownership
        const isOwner =
          loggedInUser &&
          categoryData.user &&
          (categoryData.user._id === loggedInUser._id ||
            categoryData.user === loggedInUser._id);

        // 3️⃣ Fetch notes based on ownership
        const notesRes = isOwner
          ? await axiosInstance.get(`/api/notes/category/${categoryId}`, {
            params: { page: 1, limit: 100 },
          })
          : await axiosInstance.get(
            `/api/notes/category/${categoryId}/public`,
            { params: { page: 1, limit: 100 } }
          );

        const sortedNotes = (notesRes.data.notes || []).sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );

        setNotes(sortedNotes);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load category."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndNotes();
  }, [categoryId, loggedInUser]);




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

  const handleDownloadAll = async () => {
    if (notes.length === 0) {
      toast.info("No notes to export.");
      return;
    }

    setExportState({ isExporting: true, progress: 0, currentTitle: "Starting export..." });

    try {
      await exportCategoryAsZip(category, notes, ({ current, total, title }) => {
        setExportState(prev => ({
          ...prev,
          progress: current / total,
          currentTitle: title
        }));
      });
      toast.success("Category exported successfully!");
    } catch (err) {
      toast.error("Failed to export category.");
    } finally {
      setExportState({ isExporting: false, progress: 0, currentTitle: "" });
    }
  };

  const handleDeleteCategory = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/categories/${categoryId}`);
      toast.success("Category deleted");
      navigate("/profile/MyProfile");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(
        err.response?.data?.error || "Failed to delete category"
      );
    } finally {
      setDeleting(false);
      setShowDeletePopup(false);
    }
  };

  // 🧠 DOUBLE CONFIRM LOGIC
  const handleConfirmDelete = () => {
    if (confirmStep === 1) {
      setConfirmStep(2);
      return;
    }
    handleDeleteCategory();
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
        onClose={() => {
          setShowDeletePopup(false);
          setConfirmStep(1);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        message={
          confirmStep === 1
            ? "Are you sure you want to delete this category?"
            : "FINAL WARNING: This will permanently delete ALL notes under this category. This action CANNOT be undone."
        }
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
        onDownloadAll={handleDownloadAll}
        onCreateNote={handleCreateNote}
        isAuthenticated={!!loggedInUser}
        onUserClick={handleUserClick}
      />

      <DownloadProgress
        isExporting={exportState.isExporting}
        progress={exportState.progress}
        currentTitle={exportState.currentTitle}
      />


      <div
        className="mb-8 mx-auto w-full p-10 shadow-xl border border-muted rounded-b-lg"
      >
        <MarkdownUploadBox
          dragActive={dragActive}
          dragHandlers={dragHandlers}
          onFileSelect={handleUpload}
        />

        <UploadQueueDisplay
          getUploadQueue={getUploadQueue}
          clearUploadQueue={clearUploadQueue}
          resumeQueue={resumeQueue}
          categoryId={categoryId}
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

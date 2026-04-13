import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

import { Loading } from "@/features/home";
import { ErrorState, ConfirmPopUp } from "@/components/ui";
import ProUpgradeModal from "@/components/ui/ProUpgradeModal";
import { noteCache } from "@/utils/noteCache";

import CategoryHeader from "@/features/category/CategoryHeader";
import CategoryNotesList from "@/features/category/CategoryNotesList";
import MarkdownUploadBox from "@/features/category/MarkdownUploadBox";
import UploadQueueDisplay from "@/features/category/UploadQueueDisplay";
import DownloadProgress from "@/features/category/DownloadProgress";
import BulkTagModal from "@/features/category/BulkTagModal";

import useMarkdownUploadQueue from "@/hooks/useMarkdownUploadQueue";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import { exportCategoryAsZip } from "@/utils/exportCategoryAsZip";



const Category = () => {
  const { user: loggedInUser } = useAuth();
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [notes, setNotes] = useState([]);
  const [totalNotesCount, setTotalNotesCount] = useState(0);
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

  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  const [showProUpgradeModal, setShowProUpgradeModal] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showBulkDeletePopup, setShowBulkDeletePopup] = useState(false);
  const [bulkConfirmStep, setBulkConfirmStep] = useState(1);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const PAGE_SIZE = 50;

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

  const { 
    handleUpload, 
    getUploadQueue, 
    clearUploadQueue, 
    resumeQueue, 
    uploadReport, 
    clearReport 
  } = useMarkdownUploadQueue(
    categoryId, 
    setNotes, 
    loggedInUser,
    () => setShowProUpgradeModal(true)
  );

  const { dragActive, handlers: dragHandlers } = useDragAndDrop({
    onFilesDrop: (files) =>
      handleUpload({ target: { value: "" } }, files),
    fileFilter: (f) => f.name.endsWith(".md"),
  });

  /* ---------------- Data Fetch ---------------- */

  const fetchCategoryAndNotes = async ({ pageNum = 1, append = false }) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      let currentCategory = category;

      // 1️⃣ Fetch category metadata only on initial load or if not present
      if (!currentCategory || !append) {
        const categoryRes = await axiosInstance.get(
          `/api/categories/${categoryId}/public`
        );
        currentCategory = categoryRes.data;
        setCategory(currentCategory);
        setUser(currentCategory.user);
        setEditName(currentCategory.name);
        setEditType(currentCategory.type || "");
      }

      // 2️⃣ Detect ownership
      const isOwner =
        loggedInUser &&
        currentCategory.user &&
        (currentCategory.user._id === loggedInUser._id ||
          currentCategory.user === loggedInUser._id);

      // 3️⃣ Fetch notes based on ownership
      const targetUrl = isOwner
        ? `/api/notes/category/${categoryId}`
        : `/api/notes/category/${categoryId}/public`;

      const notesRes = await axiosInstance.get(targetUrl, {
        params: { page: pageNum, limit: PAGE_SIZE },
      });

      const newNotes = notesRes.data.notes || [];
      const totalNotes = notesRes.data.total || 0;
      setTotalNotesCount(totalNotes);

      setNotes(prev => {
        const combined = append ? [...prev, ...newNotes] : newNotes;
        return combined.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        );
      });

      setHasMore(pageNum * PAGE_SIZE < totalNotes);
    } catch (err) {
      console.error("fetchCategoryAndNotes error:", err);
      setError(
        err.response?.data?.message || err.response?.data?.error || "Failed to load category please try again later when the backend is online."
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchCategoryAndNotes({ pageNum: 1, append: false });
  }, [categoryId, loggedInUser]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchCategoryAndNotes({ pageNum: next, append: true });
  };




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
      await exportCategoryAsZip(category, notes, ({ progress, title }) => {
        setExportState(prev => ({
          ...prev,
          progress: progress,
          currentTitle: title
        }));
      }, isOwner);

      // Delay so user actually sees the 100% bar
      await new Promise(resolve => setTimeout(resolve, 800));

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

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      const response = await axiosInstance.post("/api/notes/bulk-delete", {
        noteIds: selectedNoteIds,
      });
      toast.success(response.data.message || "Notes deleted");
      setSelectedNoteIds([]);
      // Reload current view
      fetchCategoryAndNotes({ pageNum: 1, append: false });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete notes");
    } finally {
      setBulkDeleting(false);
      setShowBulkDeletePopup(false);
      setBulkConfirmStep(1);
    }
  };

  const onBulkDeleteClick = () => {
    if (selectedNoteIds.length === 0) {
      toast.info("Please select some notes first.");
      return;
    }
    setShowBulkDeletePopup(true);
  };

  const handleConfirmBulkDelete = () => {
    if (bulkConfirmStep === 1) {
      setBulkConfirmStep(2);
      return;
    }
    handleBulkDelete();
  };
  /* ---------------- Guards ---------------- */

  if (loading) return <Loading />;
  if (error) return (
    <ErrorState 
      title="Category Unavailable" 
      message={error} 
      onRetry={() => fetchCategoryAndNotes({ pageNum: 1, append: false })} 
    />
  );
  if (!category) return (
    <ErrorState 
      title="Not Found" 
      message="The category you are looking for does not exist or has been removed." 
      type="not-found"
    />
  );

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

      <ConfirmPopUp
        open={showBulkDeletePopup}
        onClose={() => {
          setShowBulkDeletePopup(false);
          setBulkConfirmStep(1);
        }}
        onConfirm={handleConfirmBulkDelete}
        loading={bulkDeleting}
        message={
          bulkConfirmStep === 1
            ? `Are you sure you want to delete ${selectedNoteIds.length} selected notes?`
            : "FINAL WARNING: This will permanently delete the selected notes. This action CANNOT be undone."
        }
      />

      <CategoryHeader
        category={category}
        user={user}
        isOwner={isOwner}
        totalNotesCount={totalNotesCount}
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
        onBulkTagClick={() => {
          if (selectedNoteIds.length === 0) {
            toast.info("Please select some notes first.");
            return;
          }
          setShowBulkTagModal(true);
        }}
        onBulkDeleteClick={onBulkDeleteClick}
        selectedNotesCount={selectedNoteIds.length}
        isAuthenticated={!!loggedInUser}
        onUserClick={handleUserClick}
        loggedInUser={loggedInUser}
        onOpenProModal={() => setShowProUpgradeModal(true)}
      />

      <ProUpgradeModal 
        open={showProUpgradeModal} 
        onClose={() => setShowProUpgradeModal(false)} 
      />

      <DownloadProgress
        isExporting={exportState.isExporting}
        progress={exportState.progress}
        currentTitle={exportState.currentTitle}
      />


      <div
        className="mb-8 mx-auto w-full p-10 shadow-xl border border-muted rounded-b-lg"
      >
        {isOwner && (
          <>
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
              uploadReport={uploadReport}
              clearReport={clearReport}
              categoryName={category?.name}
            />
          </>
        )}

        <CategoryNotesList
          notes={notes}
          onNoteClick={handleNoteClick}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
          isOwner={isOwner}
          selectedNoteIds={selectedNoteIds}
          onSelectionChange={setSelectedNoteIds}
        />

        <BulkTagModal
          open={showBulkTagModal}
          onClose={() => setShowBulkTagModal(false)}
          selectedNotes={notes.filter(n => selectedNoteIds.includes(n._id))}
          category={category}
          clearSelection={() => {
            setSelectedNoteIds([]);
            noteCache.clear();
            fetchCategoryAndNotes({ pageNum: 1, append: false });
          }}
          loggedInUser={loggedInUser}
        />
      </div>
    </div>
  );
};

export default Category;

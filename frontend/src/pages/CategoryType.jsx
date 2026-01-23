import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { ListContainer, Loader, ConfirmPopUp } from "@/components/ui";
import { DottedButton2 } from "@/components/ui/buttons";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import TrashIcon from "@/assets/svg/TrashIcon";

const CategoryType = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ FIX 1

  const [categoryType, setCategoryType] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [confirmStep, setConfirmStep] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // OWNER route
        const res = await axiosInstance.get(
          `/api/category-types/${id}/categories`
        );

        setCategoryType(res.data.categoryType);
        setCategories(res.data.categories || []);
      } catch (err) {
        const status = err.response?.status;

        if (status === 401 || status === 403 || status === 404) {
          try {
            // PUBLIC fallback
            const res = await axiosInstance.get(
              `/api/category-types/${id}/public/categories`
            );

            setCategoryType(res.data.categoryType);
            setCategories(res.data.categories || []);
          } catch (err) {
            toast.error("Failed to load category type");
          }
        } else {
          toast.error("Failed to load category type");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);




  const handleDeleteCategoryType = async () => {
    if (deleting) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/category-types/${id}`);
      toast.success("Category type deleted permanently");
      navigate("/my-category-types");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete category type");
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
    handleDeleteCategoryType();
  };

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
            ? "Are you sure you want to delete this category type?"
            : "FINAL WARNING: This will permanently delete ALL categories and ALL notes under this category type."
        }
      />

      <ListContainer title={categoryType?.name || "Category Type"}>
        {loading && <Loader variant="dots" text="Loading…" />}

        {/* ✅ owner-only delete */}
        {!loading && categoryType && user && (
          <div className="flex justify-end mb-4">
            <div
              className={`p-2 rounded-full border border-muted transition-all duration-150
                ${deleting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer text-type-3 hover:text-black hover:bg-red-500 hover:translate-y-[-4px]"
                }`}
              title="Delete this category type"
              onClick={() => {
                setConfirmStep(1);
                setShowDeletePopup(true);
              }}
            >
              <TrashIcon />
            </div>
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center text-type-3">
            No categories under this type.
          </div>
        )}

        {!loading && categories.length > 0 && (
          <div className="flex flex-col gap-2">
            {categories.map(cat => (
              <DottedButton2
                key={cat._id}
                text={cat.name}
                className="w-full"
                onClick={() => navigate(`/category/${cat._id}`)}
              />
            ))}
          </div>
        )}
      </ListContainer>
    </>
  );
};

export default CategoryType;

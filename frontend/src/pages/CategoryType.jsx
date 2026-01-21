import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ListContainer from "../components/common/ListContainer";
import Skeleton from "../components/skeletons/Skeleton";
import DottedButton2 from "../components/buttons/DottedButton2";

const CategoryType = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryType, setCategoryType] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/api/category-types/${id}/categories`)
      .then(res => {
        setCategoryType(res.data.categoryType);
        setCategories(res.data.categories || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <ListContainer title={categoryType?.name || "Category Type"}>
      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="text-center text-type-3">
          No categories under this type.
        </div>
      )}

      {!loading && (
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
  );
};

export default CategoryType;

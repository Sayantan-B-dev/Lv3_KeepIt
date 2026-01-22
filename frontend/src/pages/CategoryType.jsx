import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ListContainer from "../components/common/ListContainer";
import DottedButton2 from "../components/buttons/DottedButton2";
import Loader from '../components/common/Loader';

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
        <Loader  variant="dots" text="Loading…" />
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

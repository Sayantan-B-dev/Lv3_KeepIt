import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
;
import { ListContainer } from "@/components/ui";
import { SearchBar } from "@/components/ui";
import { DottedButton } from "@/components/ui/buttons";
import { DottedButton2 } from "@/components/ui/buttons";
import { Loader } from "@/components/ui";


const PAGE_SIZE = 15;

const MyCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchTimeout = useRef(null);

  const fetchCategories = async ({ pageNum = 1, append = false }) => {
    append ? setLoadingMore(true) : setLoading(true);

    try {
      const res = await axiosInstance.get("/api/categories", {
        params: { page: pageNum, limit: PAGE_SIZE, search },
      });

      const data = res.data || [];
      setCategories(prev => (append ? [...prev, ...data] : data));
      setHasMore(data.length === PAGE_SIZE);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchCategories({ pageNum: 1 });
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchCategories({ pageNum: next, append: true });
  };

  return (
    <ListContainer title="My Categories">
      <SearchBar value={search} onChange={setSearch} placeholder="Search categories" />

      {loading && (
                <Loader variant="dots" text="Loading…" />

      )}

      {!loading && categories.length === 0 && (
        <div className="text-center text-type-3">No categories found.</div>
      )}

      {!loading && (
        <div className="gridy">
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
                {loadingMore &&<Loader  variant="dots" text="Loading…" />}

      {hasMore && !loading && !loadingMore && (
        <div className="flex justify-center mt-6">
          <DottedButton
            text={loadingMore ? "Loading…" : "Load More"}
            onClick={handleLoadMore}
          />
        </div>
      )}
    </ListContainer>
  );
};

export default MyCategories;

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

const MyCategoryTypes = () => {
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchTimeout = useRef(null);

  const fetchTypes = async ({ pageNum = 1, append = false }) => {
    append ? setLoadingMore(true) : setLoading(true);

    try {
      const res = await axiosInstance.get("/api/category-types/my-category-types", {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          search,
        },
      });

      const data = res.data.types || [];

      setTypes(prev => (append ? [...prev, ...data] : data));
      setHasMore(res.data.hasMore);
      
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // initial load + debounced search
  useEffect(() => {
    setPage(1);
    setHasMore(true);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchTypes({ pageNum: 1 });
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchTypes({ pageNum: next, append: true });
  };

  return (
    <ListContainer title="My Category Types">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search category types"
      />

      {/* initial skeleton */}
      {loading && (
                <Loader variant="dots" text="Loading…" />

      )}

      {!loading && types.length === 0 && (
        <div className="text-center text-type-3">
          No category types found.
        </div>
      )}

      {!loading && (
        <div className="gridy">
          {types.map(type => (
            <DottedButton2
              key={type._id}
              text={type.name}
              className="w-full"
              onClick={() => navigate(`/category-type/${type._id}`)}
            />
          ))}
        </div>
      )}
      {loadingMore &&<Loader  variant="dots" text="Loading…" />}
      {hasMore && (
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

export default MyCategoryTypes;

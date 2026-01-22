import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ListContainer from "../components/common/ListContainer";
import SearchBar from "../components/common/SearchBar";
import DottedButton from "../components/buttons/DottedButton";
import DottedButton2 from "../components/buttons/DottedButton2";
import Loader from '../components/common/Loader';

const PAGE_SIZE = 15;

const MyTags = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchTimeout = useRef(null);

  const fetchTags = async ({ pageNum = 1, append = false }) => {
    append ? setLoadingMore(true) : setLoading(true);

    try {
      const res = await axiosInstance.get("/api/notes/my-tags", {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          search,
        },
      });

      const data = res.data.tags || [];

      setTags(prev => (append ? [...prev, ...data] : data));
      setHasMore(res.data.hasMore);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      fetchTags({ pageNum: 1 });
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchTags({ pageNum: next, append: true });
  };

  return (
    <ListContainer title="My Tags">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search tags"
      />

      {loading && (
                <Loader variant="dots" text="Loading…" />

      )}

      {!loading && tags.length === 0 && (
        <div className="text-center text-type-3">
          No tags found.
        </div>
      )}

      {!loading && (
        <div className="gridy">
          {tags.map(t => (
            <DottedButton2
              key={t.tag}
              text={`#${t.tag} • ${t.count} note${t.count !== 1 ? "s" : ""}`}
              className="w-full"
              onClick={() =>
                navigate(`/tag/${encodeURIComponent(t.tag)}`)
              }
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

export default MyTags;

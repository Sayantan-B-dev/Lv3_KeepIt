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

const MyNotes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchTimeout = useRef(null);

  const fetchNotes = async ({ pageNum = 1, append = false }) => {
    append ? setLoadingMore(true) : setLoading(true);

    try {
      const res = await axiosInstance.get("/api/notes/my", {
        params: { page: pageNum, limit: PAGE_SIZE, search },
      });

      const data = res.data.notes || [];
      setNotes(prev => (append ? [...prev, ...data] : data));
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
      fetchNotes({ pageNum: 1 });
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchNotes({ pageNum: next, append: true });
  };

  return (
    <ListContainer title="My Notes">
      <SearchBar value={search} onChange={setSearch} placeholder="Search notes" />

      {loading && (
        <Loader variant="dots" text="Loading…" />
      )}

      {!loading && notes.length === 0 && (
        <div className="text-center text-type-3">No notes found.</div>
      )}

      {!loading && (
        <div className="gridy">
          {notes.map(note => (
            <DottedButton2
              key={note._id}
              text={note.title}
              className="w-full"
              onClick={() => navigate(`/note/${note._id}`)}
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

export default MyNotes;

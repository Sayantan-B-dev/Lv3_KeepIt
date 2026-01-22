import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import ListContainer from "../components/common/ListContainer";
import SearchBar from "../components/common/SearchBar";
import DottedButton from "../components/buttons/DottedButton";
import DottedButton2 from "../components/buttons/DottedButton2";
import Author from "../components/Author";
import Loader from '../components/common/Loader';


const PAGE_SIZE = 15;

const AllNotes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchTimeout = useRef(null);

  const fetchNotes = async ({ pageNum = 1, append = false }) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await axiosInstance.get("/api/global/all-notes", {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          search: search || undefined,
        },
      });

      const data = res.data?.notes || res.data || [];

      setNotes(prev => (append ? [...prev, ...data] : data));
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
      fetchNotes({ pageNum: 1, append: false });
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchNotes({ pageNum: next, append: true });
  };

  const handleUserClick = (userId) => {
    if (user && userId === user._id) {
      navigate("/profile/MyProfile");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <ListContainer title="Notes">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search notes"
      />

      {/* Initial loading */}
      {loading && (
        <Loader  variant="dots" text="Loading…" />
      )}

      {!loading && (
        <div className="gridy">
          {notes.map(note => (
            <div
              key={note._id}
              className="flex items-center gap-3 mx-auto w-full"
            >
              <DottedButton2
                text={note.title}
                className="w-full text-center"
                onClick={() => navigate(`/note/${note._id}`)}
                innerComponent={
                  <div className="w-12 h-12">
                    <Author
                      user={note.user}
                      handleUserClick={handleUserClick}
                    />
                  </div>
                }
              />
            </div>
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

export default AllNotes;

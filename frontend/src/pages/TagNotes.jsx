import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "@/api/axiosInstance";


import { DottedButton, DottedButton2 } from "@/components/ui/buttons";
import Author from "@/components/common/Author";
import { SearchBar, Loader } from "@/components/ui";



const PAGE_SIZE = 15;

const TagNotes = () => {
  const { tagname } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);        // initial load
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(
          `/api/notes?tag=${encodeURIComponent(tagname)}`
        );
        setNotes(res.data || []);
      } catch {
        setError('Failed to fetch notes for this tag.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [tagname]);

  // reset pagination on search or tag change
  useEffect(() => {
    setPage(1);
  }, [search, tagname]);

  const filteredNotes = notes.filter(note =>
    note.title?.toLowerCase().includes(search.toLowerCase())
  );

  const visibleNotes = filteredNotes.slice(0, page * PAGE_SIZE);
  const hasMore = filteredNotes.length > visibleNotes.length;

  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);

    setTimeout(() => {
      setPage(p => p + 1);
      setLoadingMore(false);
    }, 300);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div
      className="
        mx-auto mb-5
        w-full
        p-6 sm:p-8
        relative
        border border-muted
        rounded-lg
        bg-type-b1
        glass-panel
      "
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-type-1 text-center mb-4">
          Notes tagged with
        </h2>

        <span
          className="
            px-4 py-1.5
            rounded-full
            text-xs font-mono
            bg-black text-type-3
            border border-muted2
            hover:scale-105
            shadow-sm
            transition
            cursor-pointer
          "
        >
          #{tagname}
        </span>
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search notes"
      />

      {/* Initial load skeletons */}
      {loading && (
        <Loader  variant="dots" text="Loading…" />
      )}

      {error && (
        <div className="text-center text-red-500 font-medium">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex flex-col gap-3">
            {visibleNotes.length === 0 ? (
              <div className="text-center text-type-3">
                No notes found with this tag.
              </div>
            ) : (
              visibleNotes.map(note => (
                <div
                  key={note._id}
                  className="flex items-center gap-3 w-full mx-auto"
                >
                  <DottedButton2
                    text={note.title}
                    className="w-full text-sm"
                    href={`/note/${note._id}`}
                  />

                  <div className="w-12 h-12 shrink-0">
                    <Author
                      user={note.user}
                      handleUserClick={handleUserClick}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          {loadingMore &&<Loader  variant="dots" text="Loading…" />}
          {hasMore && !loadingMore && (
            <div className="flex justify-center mt-6">
              <DottedButton text="Load More" onClick={handleLoadMore} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TagNotes;

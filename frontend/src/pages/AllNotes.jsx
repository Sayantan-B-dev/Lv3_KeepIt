import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import DottedButton2 from '../components/buttons/DottedButton2';
import Author from '../components/Author';
import { useAuth } from '../context/AuthContext';

// Skeleton loader for notes
const NoteSkeleton = () => (
  <div
    className="flex items-center gap-2 w-[70%] m-auto animate-pulse"
    style={{
      border: '1px solid black',
      borderRadius: '60px',
      padding: '10px 16px',
      background: 'rgba(255,255,255,0.08)',
      marginBottom: '8px',
      minHeight: '48px',
    }}
  >
    <div className="flex-1 h-6 bg-gray-200 rounded" style={{ border: '1px solid black' }}></div>
    <div className="w-12 h-12 bg-gray-200 rounded-full" style={{ border: '1px solid black' }}></div>
  </div>
);

const PAGE_SIZE = 15;

const AllNotes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef(null);

  // Fetch notes with pagination and search
  const fetchNotes = async ({ pageNum = 1, searchTerm = "", append = false } = {}) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      // Use query params for pagination and search
      const res = await axiosInstance.get('/api/global/all-notes', {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          search: searchTerm.trim() || undefined,
        },
      });
      const data = res.data?.notes || res.data || [];
      // If backend returns {notes, total, ...}, use .notes, else fallback to array
      if (append) {
        setNotes(prev => [...prev, ...data]);
      } else {
        setNotes(data);
      }
      // If less than PAGE_SIZE, no more data
      setHasMore(Array.isArray(data) && data.length === PAGE_SIZE);
    } catch (err) {
      setError('Failed to load notes.');
      if (!append) setNotes([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setInitialLoad(false);
    }
  };

  // Initial load and when search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setSearching(true);
    // Debounce search for 300ms
    searchTimeout.current = setTimeout(() => {
      fetchNotes({ pageNum: 1, searchTerm: search, append: false });
      setSearching(false);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
    // eslint-disable-next-line
  }, [search]);

  // Load more handler
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotes({ pageNum: nextPage, searchTerm: search, append: true });
  };

  const handleUserClick = (userId) => {
    if (user && userId === user._id) {
      navigate("/profile/MyProfile");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    
      <div
        className="container mx-auto p-6 max-w-3xl shadow-2xl border-1 border-dashed border-black mt-10 mb-22 relative w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl"
        style={{
          backdropFilter: 'blur(2px)',
          backdropShadow: '20px',
          background: 'rgba(255, 255, 255, 0.01)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
          borderRadius: '60px',
        }}
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-black mb-8">All Notes</h2>

        <div className="flex items-center gap-3 w-full mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search notes"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 h-10 px-4 rounded-md border-1 border-gray-300 text-black focus:outline-none focus:border-black"
            style={{
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(12px)',
              background: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
              borderRadius: '60px',
            }}
          />
        </div>
        {(loading || initialLoad || searching) && (
          <div className="flex flex-col gap-2" style={{ listStyle: 'none', padding: 0 }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <NoteSkeleton key={idx} />
            ))}
          </div>
        )}
        {error && <div style={{ color: '#e63946' }}>{error}</div>}
        {!loading && !initialLoad && !searching && !error && (
          <div style={{ listStyle: 'none', padding: 0 }} className="flex flex-col gap-2">
            {notes.length === 0 ? (
              <div className='text-center text-red-500'>No notes found.</div>
            ) : (
              notes.map((note) => (
                <div key={note._id || note.title} className="flex items-center gap-2 w-[70%] m-auto">
                  <DottedButton2
                    style={{ fontSize: "12px" }}
                    key={note._id || note.title}
                    text={note.title}
                    className="w-full"
                    onClick={() => navigate(`/note/${note._id}`)}
                  />
                  <div className="w-12 h-12">
                    <Author user={note.user} handleUserClick={handleUserClick} />
                  </div>
                </div>
              ))
            )}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-4 mx-auto px-6 py-2 border border-black rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition"
                style={{ minWidth: 120 }}
              >
                {loadingMore ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Loading</span>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full"></span>
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            )}
            {loadingMore && (
              <div className="flex flex-col gap-2 mt-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <NoteSkeleton key={`loadmore-skel-${idx}`} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    
  );
};

export default AllNotes;
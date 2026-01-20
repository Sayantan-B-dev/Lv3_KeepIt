import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import DottedButton from '../components/buttons/DottedButton';
import DottedButton2 from '../components/buttons/DottedButton2';

// Skeleton loader for tags
const TagSkeleton = () => (
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
    <div className="w-10 h-4 bg-gray-200 rounded" style={{ border: '1px solid black' }}></div>
  </div>
);

const PAGE_SIZE = 15;

const AllTags = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]); // [{ tag: 'example', count: 3 }, ...]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get('/api/notes/tags');
        setTags(res.data || []);
      } catch (err) {
        setError('Failed to load tags.');
        setTags([]);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };
    fetchTags();
  }, []);

  // Debounced search behavior
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setSearching(true);
    searchTimeout.current = setTimeout(() => {
      setSearching(false);
    }, 300);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
    // eslint-disable-next-line
  }, [search]);

  // Filter tags based on search input (case-insensitive)
  const filteredTags = tags.filter(tagObj =>
    tagObj.tag && tagObj.tag.toLowerCase().includes(search.toLowerCase())
  );
  // Sort by tag name (case-insensitive)
  const sortedTags = filteredTags.sort((a, b) => a.tag.localeCompare(b.tag, undefined, { sensitivity: 'base' }));
  const visibleTags = sortedTags.slice(0, page * PAGE_SIZE);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    setPage(nextPage);
    const totalAfterNext = nextPage * PAGE_SIZE;
    if (sortedTags.length <= totalAfterNext) {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  return (

      <div className='container mx-auto p-6 max-w-3xl shadow-2xl border-1 border-dashed border-black mt-10 mb-21 relative w-[90%] max-w-full md:max-w-2xl lg:max-w-3xl'
        style={{
          backdropFilter: 'blur(2px)',
          backdropShadow: '20px',
          background: 'rgba(255, 255, 255, 0.01)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
          borderRadius: '60px',
        }}>
        <h2 className='text-2xl font-bold text-center mb-4 text-black mb-8'>All Tags</h2>
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
            placeholder="Search tags"
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
              <TagSkeleton key={idx} />
            ))}
          </div>
        )}
        {error && <div style={{ color: '#e63946' }}>{error}</div>}
        {!loading && !initialLoad && !searching && !error && (
          <div style={{ listStyle: 'none', padding: 0 }} className='flex flex-col gap-2'>
            {sortedTags.length === 0 ? (
              <div className='text-center text-red-500'>No tags found.</div>
            ) : (
              visibleTags.map((tagObj) => (
                <div key={tagObj.tag} className='flex items-center gap-2 w-[70%] m-auto'>
                  <DottedButton2
                    style={{ fontSize: "12px" }}
                    key={tagObj.tag}
                    text={`#${tagObj.tag}`}
                    className='w-full'
                    onClick={() => navigate(`/tag/${encodeURIComponent(tagObj.tag)}`)}
                  />
                  <div className='text-xs text-gray-500 font-semibold px-2 whitespace-nowrap'>
                    {tagObj.count} note{tagObj.count !== 1 ? 's' : ''}
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
                  <TagSkeleton key={`loadmore-skel-${idx}`} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

  );
};

export default AllTags; 
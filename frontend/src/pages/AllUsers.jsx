import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import UserBox from '../components/home/UserBox';

// Skeleton loader for users
const UserSkeleton = () => (
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

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/profile/users');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchUsers();
  }, []);

  // Debounced search
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

  // Filter users based on search input (case-insensitive, by username or name)
  const filteredUsers = users.filter(user => {
    const searchLower = search.toLowerCase();
    return (
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.name && user.name.toLowerCase().includes(searchLower))
    );
  });
  // Sort by username or name (case-insensitive)
  const sortedUsers = filteredUsers.sort((a, b) => {
    const aName = a.username || a.name || '';
    const bName = b.username || b.name || '';
    return aName.localeCompare(bName, undefined, { sensitivity: 'base' });
  });

  const visibleUsers = sortedUsers.slice(0, page * PAGE_SIZE);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    setPage(nextPage);
    const totalAfterNext = nextPage * PAGE_SIZE;
    if (sortedUsers.length <= totalAfterNext) {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  const containerStyle = {
    backdropFilter: 'blur(2px)',
    backdropShadow: '20px',
    background: 'rgba(255, 255, 255, 0.01)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 32px 0 rgba(31, 38, 135, 0.10)',
    borderRadius: '60px',
  };

  return (
  
      <div className="container mx-auto p-6 shadow-2xl border-1 border-dashed border-black mt-10 mb-21 relative w-[90%] max-w-[90%] md:max-w-2xl lg:max-w-3xl"
        style={{
          width: '90%',
          maxWidth: '90%',
          ...containerStyle,
        }}>
        <h1 className="text-2xl font-bold text-center mb-4 text-black mb-8">All Users</h1>
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
            placeholder="Search users"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 h-10 px-4 rounded-md border-1 border-gray-300 text-black focus:outline-none focus:border-black"
            style={{
              ...containerStyle,
            }}
          />
        </div>
        {(loading || initialLoad || searching) && (
          <div className="flex flex-col gap-2" style={{ listStyle: 'none', padding: 0 }}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <UserSkeleton key={idx} />
            ))}
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !initialLoad && !searching && !error && (
          <div id="explore-users">
            {sortedUsers.length === 0 ? (
              <div className="text-center text-red-500">No users found.</div>
            ) : (
              <UserBox users={visibleUsers} />
            )}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-4 mx-auto px-6 py-2 border border-black rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition block"
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
                  <UserSkeleton key={`loadmore-skel-${idx}`} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

  );
};

export default AllUsers;

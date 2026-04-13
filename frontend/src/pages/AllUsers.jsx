import { useEffect, useRef, useState } from 'react';
import axiosInstance from "@/api/axiosInstance";
import { UserBox } from "@/features/home";

import { ListContainer, SearchBar, Loader, ErrorState } from "@/components/ui";
import { DottedButton } from "@/components/ui/buttons";

const PAGE_SIZE = 15;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);        // initial load
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const searchTimeout = useRef(null);

  const fetchUsers = async ({ pageNum = 1, append = false } = {}) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get('/api/profile/users', {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          search: search || undefined,
        },
      });

      const data = res.data;
      const newUsers = Array.isArray(data) ? data : (data.notes || data.users || []);

      setUsers(prev =>
        append ? [...prev, ...newUsers] : newUsers
      );

      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError("Failed to load users please try again later when the backend is online.");
      if (!append) setUsers([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // initial load + search (debounced)
  useEffect(() => {
    setPage(1);
    setHasMore(true);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchUsers({ pageNum: 1, append: false });
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUsers({ pageNum: nextPage, append: true });
  };

  return (
    <ListContainer title="Users">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search users"
      />

      {/* Initial loading */}
      {loading && (
        <Loader variant="dots" text="Loading…" />
      )}

      {error && (
        <ErrorState 
          title="Users Unavailable" 
          message={error} 
          onRetry={() => fetchUsers({ pageNum: 1, append: false })} 
        />
      )}

      {!loading && !error && users.length === 0 && (
        <div className="text-center text-type-3 py-6">
          No users found.
        </div>
      )}

      {!loading && !error && (
        <div className="
        w-full mb-4 sm:mb-5 p-3 sm:p-5
        grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4
        rounded-xl
        border border-muted
        bg-type-1 backdrop-blur-md
      " >
          <UserBox users={users} />
        </div>
      )}
      {loadingMore && <Loader variant="dots" text="Loading…" />}
      {hasMore && !loading && !loadingMore && (
        <div className="flex justify-center mt-5 sm:mt-6">
          <DottedButton
            text={loadingMore ? 'Loading…' : 'Load More'}
            onClick={handleLoadMore}
            className="w-full sm:w-auto"
          />
        </div>
      )}
    </ListContainer>
  );
};

export default AllUsers;

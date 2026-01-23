import { useEffect, useRef, useState } from 'react';
import axiosInstance from "@/api/axiosInstance";
import { UserBox } from "@/features/home";

import { ListContainer, SearchBar, Loader } from "@/components/ui";
import { DottedButton } from "@/components/ui/buttons";

const PAGE_SIZE = 15;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);        // initial load
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchTimeout = useRef(null);

  const fetchUsers = async ({ pageNum = 1, append = false } = {}) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await axiosInstance.get('/api/profile/users', {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          search: search || undefined,
        },
      });

      const data = res.data || [];

      setUsers(prev =>
        append ? [...prev, ...data] : data
      );

      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to fetch users', err);
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
        <Loader  variant="dots" text="Loading…" />
      )}

      {!loading && users.length === 0 && (
        <div className="text-center text-type-3 py-6">
          No users found.
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-4">
          {users.map(user => (
            <UserBox key={user._id} users={[user]} />
          ))}

        </div>
      )}
          {loadingMore &&<Loader  variant="dots" text="Loading…" />}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <DottedButton
            text={loadingMore ? 'Loading…' : 'Load More'}
            onClick={handleLoadMore}
          />
        </div>
      )}
    </ListContainer>
  );
};

export default AllUsers;

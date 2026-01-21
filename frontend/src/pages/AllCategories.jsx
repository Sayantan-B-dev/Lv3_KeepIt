import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import ListContainer from '../components/common/ListContainer';
import SearchBar from '../components/common/SearchBar';
import DottedButton from '../components/buttons/DottedButton';
import DottedButton2 from '../components/buttons/DottedButton2';
import Author from '../components/Author';
import Skeleton from '../components/skeletons/Skeleton';

const PAGE_SIZE = 15;

const AllCategories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchTimeout = useRef(null);

  const fetchCategories = async ({ pageNum = 1, append = false } = {}) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const res = await axiosInstance.get('/api/global/all-categories', {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          search: search || undefined,
        },
      });

      const data = res.data || [];

      setCategories(prev =>
        append ? [...prev, ...data] : data
      );

      setHasMore(data.length === PAGE_SIZE);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchCategories({ pageNum: 1, append: false });
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCategories({ pageNum: nextPage, append: true });
  };

  const handleUserClick = (userId) => {
    if (user && userId === user._id) {
      navigate('/profile/MyProfile');
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <ListContainer title="Categories">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search categories"
      />

      {/* Initial load */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <div className="text-center text-type-3">
          No categories found.
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-2 w-full text-sm">
          {categories.map(cat => (
            <div
              key={cat._id}
              className="flex items-center gap-3 mx-auto w-full"
            >
              <DottedButton2
                text={cat.name}
                className="w-full"
                onClick={() => navigate(`/category/${cat._id}`)}
              />
              <div className="w-12 h-12">
                <Author
                  user={cat.user}
                  handleUserClick={handleUserClick}
                />
              </div>
            </div>
          ))}

          {/* Load-more skeletons */}
          {loadingMore && (
            <div className="flex flex-col gap-3 mt-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={`more-${i}`} />
              ))}
            </div>
          )}
        </div>
      )}

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

export default AllCategories;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import ListContainer from '../components/common/ListContainer';
import SearchBar from '../components/common/SearchBar';
import DottedButton from '../components/buttons/DottedButton';
import DottedButton2 from '../components/buttons/DottedButton2';
import Skeleton from '../components/skeletons/Skeleton';

const PAGE_SIZE = 15;

const AllTags = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);        // initial load
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    axiosInstance
      .get('/api/notes/tags')
      .then(res => setTags(res.data || []))
      .catch(() => setTags([]))
      .finally(() => setLoading(false));
  }, []);

  // reset page on search
  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = tags
    .filter(t =>
      t.tag?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      a.tag.localeCompare(b.tag, undefined, { sensitivity: 'base' })
    );

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);

    // simulate async load for UX parity
    setTimeout(() => {
      setPage(p => p + 1);
      setLoadingMore(false);
    }, 300);
  };

  return (
    <ListContainer title="Tags">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search tags"
      />

      {/* Initial load skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      )}

      {!loading && visible.length === 0 && (
        <div className="text-center text-type-3 py-6">
          No tags found.
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="flex flex-col gap-3 px-2">
          {visible.map(tag => (
            <DottedButton2
              key={tag.tag}
              text={`#${tag.tag} • ${tag.count} Doc${tag.count !== 1 ? 's' : ''}`}
              className="w-full"
              onClick={() =>
                navigate(`/tag/${encodeURIComponent(tag.tag)}`)
              }
            />
          ))}

          {/* Load-more skeletons */}
          {loadingMore &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`more-${i}`} />
            ))}
        </div>
      )}

      {hasMore && !loadingMore && (
        <div className="flex justify-center mt-6">
          <DottedButton text="Load More" onClick={handleLoadMore} />
        </div>
      )}
    </ListContainer>
  );
};

export default AllTags;

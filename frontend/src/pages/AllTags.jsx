import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
;
import { ListContainer } from "@/components/ui";
import { SearchBar } from "@/components/ui";
import { DottedButton } from "@/components/ui/buttons";
import { DottedButton2 } from "@/components/ui/buttons";
import { Loader } from "@/components/ui";


const PAGE_SIZE = 15;

const AllTags = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    axiosInstance
      .get("/api/notes/tags")
      .then(res => setTags(res.data || []))
      .catch(() => setTags([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = tags
    .filter(t =>
      t.tag?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      a.tag.localeCompare(b.tag, undefined, { sensitivity: "base" })
    );

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);

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

      {/* Initial load */}
      {loading && (
        <Loader  variant="dots" text="Loading…" />

      )}

      {!loading && visible.length === 0 && (
        <div className="text-center text-type-3 py-6">
          No tags found.
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="gridy">
          {visible.map(tag => (
            <DottedButton2
              key={tag.tag}
              text={`#${tag.tag} • ${tag.count} Doc${tag.count !== 1 ? "s" : ""}`}
              className="w-full"
              onClick={() =>
                navigate(`/tag/${encodeURIComponent(tag.tag)}`)
              }
            />
          ))}


        </div>
      )}
      {loadingMore &&<Loader  variant="dots" text="Loading…" />}
      {hasMore && !loadingMore && (
        <div className="flex justify-center mt-6">
          <DottedButton text="Load More" onClick={handleLoadMore} />
        </div>
      )}
    </ListContainer>
  );
};

export default AllTags;

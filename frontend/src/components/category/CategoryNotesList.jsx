import { useEffect, useState } from "react";
import DottedButton2 from "../buttons/DottedButton2";
import DottedButton from "../buttons/DottedButton";
import Skeleton from "../skeletons/Skeleton";

const PAGE_SIZE = 12;

const CategoryNotesList = ({ notes = [], onNoteClick }) => {
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // reset pagination when notes change (new upload, delete, etc.)
  useEffect(() => {
    setPage(1);
  }, [notes]);

  const visibleNotes = notes.slice(0, page * PAGE_SIZE);
  const hasMore = notes.length > visibleNotes.length;

  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);

    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 300);
  };

  return (
    <div className="mb-8">
      <h2 className="font-mono text-type-1 mb-4 mt-4 text-2xl text-center">
        Docs
      </h2>

      {/* Empty state */}
      {notes.length === 0 && (
        <p className="text-gray-400 italic text-center">
          No notes in this category.
        </p>
      )}

      {/* Notes */}
      {notes.length > 0 && (
        <ul className="flex flex-wrap gap-3">
          {visibleNotes.map((note) => (
            <li key={note._id} className="w-full">
              <DottedButton2
                style={{ fontSize: "12px" }}
                className="w-full text-left"
                text={note.title}
                tags={note.tags}
                onClick={() => onNoteClick(note._id)}
              />
            </li>
          ))}

          {/* Load-more skeletons */}
          {loadingMore &&
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`more-${i}`} />
            ))}
        </ul>
      )}

      {/* Load more */}
      {hasMore && !loadingMore && (
        <div className="flex justify-center mt-6">
          <DottedButton text="Load More" onClick={handleLoadMore} />
        </div>
      )}
    </div>
  );
};

export default CategoryNotesList;

import { useEffect, useState } from "react";
import DottedButton2 from "../buttons/DottedButton2";
import DottedButton from "../buttons/DottedButton";
import Loader from '../common/Loader';

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
        <ul
          className="gridy"
        >
          {visibleNotes.map((note) => (
            <li key={note._id} className="w-full h-full">
              <DottedButton2
                className="w-full h-full text-left"
                style={{ fontSize: "12px" }}
                text={note.title}
                tags={note.tags}
                onClick={() => onNoteClick(note._id)}
              />
            </li>
          ))}


        </ul>

      )}

          {loadingMore &&<Loader  variant="dots" text="Loading…" />}

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

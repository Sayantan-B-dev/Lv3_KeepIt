import { useEffect, useState } from "react";
import { DottedButton, DottedButton2 } from "@/components/ui/buttons";
import { Loader } from "@/components/ui";


const PAGE_SIZE = 12;

const CategoryNotesList = ({ notes = [], onNoteClick, hasMore, loadingMore, onLoadMore }) => {
  return (
    <div className="mb-8">
      <h2 className="font-mono text-type-1 mb-4 mt-4 text-2xl text-center uppercase tracking-widest">
        Document Archive
      </h2>

      {/* Empty state */}
      {notes.length === 0 && !loadingMore && (
        <p className="text-type-3 italic text-center font-mono opacity-50 py-10 border border-dashed border-white/5 rounded-xl">
          Zero data streams found in this category.
        </p>
      )}

      {/* Notes Grid */}
      {notes.length > 0 && (
        <ul className="gridy">
          {notes.map((note) => (
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

      {/* Load more logic */}
      <div className="flex flex-col items-center mt-10 gap-4">
        {loadingMore && <Loader variant="dots" text="Loading more..." />}

        {hasMore && !loadingMore && (
          <DottedButton
            text="Load more"
            onClick={onLoadMore}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryNotesList;

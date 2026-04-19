import { useEffect, useState } from "react";
import { DottedButton, DottedButton2 } from "@/components/ui/buttons";
import { Loader } from "@/components/ui";


const PAGE_SIZE = 12;

const CategoryNotesList = ({ 
  notes = [], 
  onNoteClick, 
  hasMore, 
  loadingMore, 
  onLoadMore,
  isOwner,
  selectedNoteIds = [],
  onSelectionChange = () => {}
}) => {
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

      {/* Selection controls (only show if there are notes and we are owner) */}
      {notes.length > 0 && isOwner && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              className="w-4 h-4 cursor-default accent-blue-500"
              checked={selectedNoteIds.length === notes.length && notes.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelectionChange(notes.map(n => n._id));
                } else {
                  onSelectionChange([]);
                }
              }}
              id="selectAll"
            />
            <label htmlFor="selectAll" className="text-type-2 font-mono text-sm cursor-default select-none">
              Select All Loaded Notes
            </label>
          </div>
          <div className="text-type-3 font-mono text-xs">
            {selectedNoteIds.length} selected
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {notes.length > 0 && (
        <ul className="gridy">
          {notes.map((note) => {
            const isSelected = selectedNoteIds.includes(note._id);
            return (
            <li key={note._id} className={`w-full h-full rounded-xl transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''}`}>
              <DottedButton2
                className={`w-full h-full text-left ${isSelected ? 'border-blue-500/50' : ''}`}
                style={{ fontSize: "12px" }}
                text={note.title}
                tags={note.tags}
                onClick={(e) => {
                  // If we click the checkbox area, we shouldn't navigate
                  // But DottedButton2 doesn't perfectly isolate it.
                  // We'll rely on onNoteClick navigating. But wait, if we are in bulk mode?
                  // Just always let clicking the button navigate, picking checkbox checks.
                  onNoteClick(note._id);
                }}
                innerComponent={
                  isOwner ? (
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 cursor-default accent-blue-500"
                      checked={isSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectionChange([...selectedNoteIds, note._id]);
                        } else {
                          onSelectionChange(selectedNoteIds.filter(id => id !== note._id));
                        }
                      }}
                    />
                  ) : null
                }
              />
            </li>
            );
          })}
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

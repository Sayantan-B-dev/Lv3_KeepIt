import React from "react";

const PublicCategoryList = ({
  categories,
  openCategoryId,
  handleCategoryDropdown,
  notesLoading,
  notesError,
  categoryNotes,
  navigate,
  handleNoteClick,
}) => {
  // Sort categories by name (case-insensitive)
  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 mt-8 text-center">
        Categories :
      </h2>
      <div className="flex flex-col flex-wrap gap-3 sm:gap-4 justify-center">
        {sortedCategories.length === 0 ? (
          <span className="text-gray-400">No categories found.</span>
        ) : (
          sortedCategories.map((cat) => (
            <div key={cat._id} className="w-full">
              <div className="flex justify-between items-center gap-2">
                <div
                  onClick={() => handleCategoryDropdown(cat._id)}
                  className="cursor-pointer text-black px-3 py-2 bg-gray-100 rounded border-1 border-black font-semibold text-left flex-1 hover:bg-gray-200 flex justify-between"
                  style={{ userSelect: "none",wordBreak: "break-all"  }} 
                >
                  <span>{cat.name}</span>
                  <span>{openCategoryId === cat._id ? "▲" : "▼"}</span>
                </div>
              </div>
              {openCategoryId === cat._id && (
                <div className="ml-4 mt-2 mb-4">
                  {notesLoading[cat._id] ? (
                    <div className="text-gray-400">Loading notes...</div>
                  ) : notesError[cat._id] ? (
                    <div className="text-red-500">{notesError[cat._id]}</div>
                  ) : (categoryNotes[cat._id]?.length > 0 ? (
                    <ul className="flex flex-col gap-2 ">
                      {[...categoryNotes[cat._id]].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })).map((note) => (
                        <li key={note._id} className="flex items-center" style={{ wordBreak: "break-all" }}>
                          <button
                            className="flex-1 text-left px-3 py-1 rounded bg-white text-black border-2 border-black hover:bg-indigo-50 transition cursor-pointer"
                            style={{border:"2px solid black"}}
                            onClick={() => handleNoteClick ? handleNoteClick(note) : navigate(`/note/${note._id}`)}
                            type="button"
                          >
                            {note.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-400 italic">No notes in this category.</div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PublicCategoryList; 
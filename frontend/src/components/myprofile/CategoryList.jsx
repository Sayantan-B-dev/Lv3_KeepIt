import React from "react";


const CategoryList = ({
  categories,
  openCategoryId,
  handleCategoryDropdown,
  notesLoading,
  notesError,
  categoryNotes,
  handleNoteClick,
  navigate,
  handleCategoryClick,
}) => {
  // Group categories by type
  const typeGroups = {};
  categories.forEach(cat => {
    const type = cat.type || 'Other';
    if (!typeGroups[type]) typeGroups[type] = [];
    typeGroups[type].push(cat);
  });
  // Sort types alphabetically, 'Other' last
  const sortedTypes = Object.keys(typeGroups).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
  });
  
  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 mt-8 text-center">
        Your Categories :
      </h2>
      <div className="flex flex-col flex-wrap gap-6 sm:gap-8 justify-center">
        {sortedTypes.map(type => (
          <div key={type} className="border-1 border-black rounded-xl p-4 bg-white/50 mb-4">
            <div className="font-bold text-lg mb-2 text-indigo-700 tracking-wide">{type}</div>
            <div className="flex flex-col gap-3">
              {typeGroups[type].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })).map((cat) => (
                <div key={cat._id} className="w-full">
                  <div className="flex justify-between items-center gap-2">
                    <div
                      onClick={() => handleCategoryDropdown(cat._id)}
                      className="cursor-pointer text-black px-3 py-2 bg-gray-100 rounded border-1 border-black font-semibold text-left flex-1 hover:bg-gray-200 flex justify-between"
                      style={{ userSelect: "none", wordBreak: "break-all" }}
                    >
                      <span>{cat.name}</span>
                      <span>{openCategoryId === cat._id ? "\u25b2" : "\u25bc"}</span>
                    </div>
                    <div
                      className="ml-2 px-3 py-2 hover:bg-white text-black rounded-md border border-black border-solid text-xs font-semibold break-words hover:cursor-pointer"
                      style={{ border: "1px solid black" }}
                      onClick={() => handleCategoryClick(cat._id)}
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="20"
                        height="20"
                        className="inline-block align-middle"
                        style={{
                          display: "inline-block",
                          verticalAlign: "middle",
                          marginRight: "2px",
                          color: "#000000",
                          fill: "currentColor",
                        }}
                      >
                        <path d="m46.84 5.32-4.16-4.16a4 4 0 0 0-5.58 0C1.7 36.55 3.65 34.52 3.53 34.88S3 36.78 0 46.72A1 1 0 0 0 1 48c.21 0 12.08-3.45 12.39-3.68s-2.75 2.79 33.45-33.42a4 4 0 0 0 0-5.58zM35 6.05 42 13l-1.37 1.37-6.97-6.95zM10.45 38.91l-1-.34-.34-1L35 11.61 36.39 13zm21.8-30.08 1.36 1.37L7.79 36l-1.71-1zM3.32 42.67a7.68 7.68 0 0 1 2 2l-2.85.84zm4 1.42a9.88 9.88 0 0 0-3.43-3.43l1.16-3.94 2 1.23c.88 2.62.38 2.08 2.94 2.94l1.23 2zM13 41.92l-1-1.71 25.8-25.82 1.37 1.36zM45.43 9.49l-2.07 2.07-6.92-6.92 2.07-2.07a1.94 1.94 0 0 1 2.75 0l4.17 4.17a1.94 1.94 0 0 1 0 2.75z" />
                      </svg>
                    </div>
                  </div>
                  {openCategoryId === cat._id && (
                    <div className="ml-4 mt-2">
                      {notesLoading[cat._id] ? (
                        <div className="text-gray-400">Loading notes...</div>
                      ) : notesError[cat._id] ? (
                        <div className="text-red-500">{notesError[cat._id]}</div>
                      ) : (categoryNotes[cat._id]?.length > 0 ? (
                        <ul className="flex flex-col gap-2 ">
                          {[...(categoryNotes[cat._id] || [])].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })).map((note) => (
                            <li key={note._id} className="flex items-center" style={{ wordBreak: "break-all" }}>
                              <button
                                className="flex-1 text-left px-3 py-1 rounded bg-white hover:bg-indigo-50 text-black"
                                style={{ border: "1px solid black" }}
                                onClick={() => handleNoteClick(note)}
                                type="button"
                              >
                                {note.title}
                              </button>
                              <button
                                className="ml-2 px-3 py-1 hover:bg-white text-black rounded-md border border-black border-solid text-xs font-semibold hover:cursor-pointer"
                                style={{ border: "1px solid black" }}
                                onClick={() => navigate(`/note/${note._id}`)}
                                type="button"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 48 48"
                                  width="20"
                                  height="20"
                                  className="inline-block align-middle "
                                  style={{
                                    display: "inline-block",
                                    verticalAlign: "middle",
                                    marginRight: "2px",
                                    color: "#000000",
                                    fill: "currentColor",
                                  }}
                                >
                                  <path d="m46.84 5.32-4.16-4.16a4 4 0 0 0-5.58 0C1.7 36.55 3.65 34.52 3.53 34.88S3 36.78 0 46.72A1 1 0 0 0 1 48c.21 0 12.08-3.45 12.39-3.68s-2.75 2.79 33.45-33.42a4 4 0 0 0 0-5.58zM35 6.05 42 13l-1.37 1.37-6.97-6.95zM10.45 38.91l-1-.34-.34-1L35 11.61 36.39 13zm21.8-30.08 1.36 1.37L7.79 36l-1.71-1zM3.32 42.67a7.68 7.68 0 0 1 2 2l-2.85.84zm4 1.42a9.88 9.88 0 0 0-3.43-3.43l1.16-3.94 2 1.23c.88 2.62.38 2.08 2.94 2.94l1.23 2zM13 41.92l-1-1.71 25.8-25.82 1.37 1.36zM45.43 9.49l-2.07 2.07-6.92-6.92 2.07-2.07a1.94 1.94 0 0 1 2.75 0l4.17 4.17a1.94 1.94 0 0 1 0 2.75z" />
                                </svg>
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList; 
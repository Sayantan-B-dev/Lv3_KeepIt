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
}) => (
  <div className="mb-8">
    <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 mt-8 text-center">
      Your Categories :
    </h2>
    <div className="flex flex-col flex-wrap gap-3 sm:gap-4 justify-center">
      {categories.length === 0 ? (
        <span className="text-gray-400">No categories found.</span>
      ) : (
        categories.map((cat) => (
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
              <button
                className="ml-2 px-3 py-2 hover:bg-white text-black rounded-md border border-black border-solid text-xs font-semibold"
                style={{ border: "2px solid black" }}
                onClick={() => handleCategoryClick(cat._id)}
                type="button"
              >
                Edit Category
              </button>
            </div>
            {openCategoryId === cat._id && (
              <div className="ml-4 mt-2 mb-4">
                {notesLoading[cat._id] ? (
                  <div className="text-gray-400">Loading notes...</div>
                ) : notesError[cat._id] ? (
                  <div className="text-red-500">{notesError[cat._id]}</div>
                ) : (categoryNotes[cat._id]?.length > 0 ? (
                  <ul className="flex flex-col gap-2 ">
                    {categoryNotes[cat._id].map((note) => (
                      <li key={note._id} className="flex items-center" style={{ wordBreak: "break-all" }}>
                        <button
                          className="flex-1 text-left px-3 py-1 rounded bg-white hover:bg-indigo-50 text-black"
                          style={{ border: "2px solid black" }}
                          onClick={() => handleNoteClick(note)}
                          type="button"
                        >
                          {note.title}
                        </button>
                        <button
                          className="ml-2 px-3 py-1 hover:bg-white text-black rounded-md border border-black border-solid text-xs font-semibold"
                          style={{ border: "2px solid black" }}
                          onClick={() => navigate(`/note/${note._id}`)}
                          type="button"
                        >
                          Edit Note
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

export default CategoryList; 
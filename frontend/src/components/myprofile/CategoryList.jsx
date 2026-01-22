import React from "react";
import DottedButton from "../buttons/DottedButton";

const CategoryList = ({
  categories,
  openCategoryId,
  handleCategoryDropdown,
  notesLoading,
  notesError,
  categoryNotes,
  categoryHasMore,
  handleLoadMore,
  handleNoteClick,
  navigate,
  handleCategoryClick,
}) => {
  /* ================= Group & sort ================= */

  const typeGroups = {};

  categories.forEach((cat) => {
    const type = cat.type || "Other";
    if (!typeGroups[type]) typeGroups[type] = [];
    typeGroups[type].push(cat);
  });

  const sortedTypes = Object.keys(typeGroups).sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  });

  return (
    <div className="mb-10">
      <h2 className="text-xl sm:text-2xl font-bold text-type-1 my-6 text-center">
        Your Docs
      </h2>

      <div className="flex flex-col gap-6 sm:gap-8">
        {sortedTypes.map((type) => {
          const categoryTypeId =
            typeGroups[type]?.[0]?.categoryType?._id;

          return (
            <div
              key={type}
              className="
                p-5
                rounded-2xl
                border border-muted
                glass-panel
                shadow-xl
              "
            >
              {/* ================= Category Type ================= */}
              <div
                onClick={() => {
                  if (categoryTypeId) {
                    navigate(`/category-type/${categoryTypeId}`);
                  }
                }}
                className="
                  mb-4
                  text-lg font-bold tracking-wide
                  text-type-1
                  underline-animation
                  w-fit
                  cursor-pointer
                  hover:opacity-90
                  transition
                "
                title="Open category type"
              >
                {type}
              </div>

              {/* ================= Categories ================= */}
              <div className="flex flex-col gap-3">
                {typeGroups[type]
                  .sort((a, b) =>
                    a.name.localeCompare(b.name, undefined, {
                      sensitivity: "base",
                    })
                  )
                  .map((cat) => (
                    <div key={cat._id} className="w-full">
                      {/* Category row */}
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => handleCategoryDropdown(cat._id)}
                          className="
                            flex-1
                            px-4 py-2
                            rounded-xl
                            border border-muted
                            cursor-pointer
                            text-type-1
                            font-semibold
                            flex justify-between items-center
                            hover:bg-white/10
                            transition
                          "
                          style={{
                            wordBreak: "break-all",
                            userSelect: "none",
                          }}
                        >
                          <span>{cat.name}</span>
                          <span className="text-xs opacity-70">
                            {openCategoryId === cat._id ? "▲" : "▼"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCategoryClick(cat._id)}
                          className="
                            px-3 py-2
                            rounded-lg
                            border border-dashed border-muted
                            hover:bg-white/10
                            transition
                          "
                          title="Open category"
                        >
                          ✎
                        </button>
                      </div>

                      {/* ================= Notes ================= */}
                      {openCategoryId === cat._id && (
                        <div className="ml-4 mt-3">
                          {notesLoading[cat._id] ? (
                            <div className="text-type-3 text-sm">
                              Loading notes…
                            </div>
                          ) : notesError[cat._id] ? (
                            <div className="text-red-400 text-sm">
                              {notesError[cat._id]}
                            </div>
                          ) : categoryNotes[cat._id]?.length > 0 ? (
                            <>
                              <ul className="flex flex-col gap-2">
                                {categoryNotes[cat._id]
                                  .slice()
                                  .sort((a, b) =>
                                    a.title.localeCompare(
                                      b.title,
                                      undefined,
                                      { sensitivity: "base" }
                                    )
                                  )
                                  .map((note) => (
                                    <li
                                      key={note._id}
                                      className="flex items-center"
                                      style={{ wordBreak: "break-all" }}
                                    >
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleNoteClick(note)
                                        }
                                        className="
                                          flex-1 text-left
                                          px-3 py-1.5
                                          rounded-lg
                                          border border-muted
                                          hover:bg-white/10
                                          text-type-1
                                          transition
                                        "
                                      >
                                        {note.title}
                                      </button>
                                    </li>
                                  ))}
                              </ul>

                              {/* ===== LOAD MORE ===== */}
                              {categoryHasMore?.[cat._id] && (
                                <div className="mt-3 w-full flex justify-center">
                                  <DottedButton
                                    text="Load more"
                                    onClick={() =>
                                      handleLoadMore(cat._id)
                                    }
                                    className="w-fit"
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-type-3 italic text-sm">
                              No notes in this category.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;

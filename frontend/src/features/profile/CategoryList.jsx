import React from "react";
import { DottedButton } from "@/components/ui/buttons";
import { Loader } from "@/components/ui";

const CategoryList = ({
  categories = [],
  openCategoryId,
  handleCategoryDropdown,
  notesLoading = {},
  notesError = {},
  categoryNotes = {},
  categoryHasMore = {},
  handleLoadMore,
  handleNoteClick,
  navigate,
  handleCategoryClick,
  isOwnProfile,
  readOnly = false,
}) => {
  /* ================= GROUP BY TYPE ================= */
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
        {isOwnProfile ? "Your Docs" : "Shared Docs"}
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
              {/* CATEGORY TYPE */}
              {categoryTypeId && (
                <div
                  onClick={() =>
                    navigate(`/category-type/${categoryTypeId}`)
                  }
                  className="
                    mb-4
                    text-lg font-mono tracking-wide
                    text-type-1
                    underline-animation
                    w-fit
                    cursor-pointer
                    break-all
                  "
                >
                  <span className="font-bold">Type :</span> {type}
                </div>
              )}

              {/* CATEGORIES */}
              <div className="flex flex-col gap-3">
                {typeGroups[type]
                  .slice()
                  .sort((a, b) =>
                    a.name.localeCompare(b.name, undefined, {
                      sensitivity: "base",
                    })
                  )
                  .map((cat) => (
                    <div key={cat._id}>
                      {/* CATEGORY ROW */}
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() =>
                            handleCategoryDropdown(cat._id)
                          }
                          className="
                            flex-1
                            px-4 py-2
                            rounded-xl
                            border border-muted
                            cursor-pointer
                            font-semibold
                            flex justify-between items-center
                            break-all
                          "
                        >
                          <span>{cat.name}</span>
                          <span className="text-xs opacity-70">
                            {openCategoryId === cat._id ? "▲" : "▼"}
                          </span>
                        </div>

                        {!readOnly && (
                          <button
                            onClick={() =>
                              handleCategoryClick(cat._id)
                            }
                            className="px-3 py-2 border border-dashed rounded-lg"
                          >
                            ✎
                          </button>
                        )}
                      </div>

                      {/* NOTES */}
                      {openCategoryId === cat._id && (
                        <div className="ml-4 mt-3">
                          {notesLoading[cat._id] ? (
                            <div className="text-sm text-type-3">
                              Loading notes…
                            </div>
                          ) : notesError[cat._id] ? (
                            <div className="text-sm text-red-400">
                              {notesError[cat._id]}
                            </div>
                          ) : categoryNotes[cat._id]?.length > 0 ? (
                            <>
                              <ul className="flex flex-col gap-2">
                                {categoryNotes[cat._id].map((note) => (
                                  <li key={note._id}>
                                    <button
                                      onClick={() =>
                                        handleNoteClick(note)
                                      }
                                      className="
                                        w-full text-left
                                        px-3 py-1.5
                                        rounded-lg
                                        border border-muted
                                        break-all
                                      "
                                    >
                                      {note.title}
                                    </button>
                                  </li>
                                ))}
                              </ul>

                              <div className="mt-3 flex justify-center min-h-[28px]">
                                {notesLoading[cat._id] ? (
                                  <Loader variant="dots" />
                                ) : (
                                  categoryHasMore?.[cat._id] && (
                                    <DottedButton
                                      text="Load more"
                                      onClick={() => handleLoadMore(cat._id)}
                                    />
                                  )
                                )}
                              </div>

                            </>
                          ) : (
                            <div className="text-sm italic text-type-3">
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

export default React.memo(CategoryList);

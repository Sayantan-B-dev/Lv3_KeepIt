import React, { useState } from "react";
import MathContent from "./MathContent";
import { MdVisibility, MdEdit } from "react-icons/md";

const NoteContent = ({
  editMode,
  editNote,
  handleInputChange,
  updateLoading,
  contentTooLarge,
  CONTENT_MAX_LENGTH,
  note,
}) => {
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div className="my-8">
      {editMode ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-type-3 uppercase tracking-widest font-bold">Edit Mode Active</span>
             </div>
             <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-xl border font-mono text-[10px] uppercase tracking-wider transition-all
                    ${previewMode 
                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                        : 'bg-white/5 border-white/10 text-type-2 hover:bg-white/10 hover:text-type-1'}
                `}
            >
                {previewMode ? (
                    <><MdEdit className="w-3 h-3" /> Hide Preview</>
                ) : (
                    <><MdVisibility className="w-3 h-3" /> Show Live Preview</>
                )}
            </button>
          </div>

          <div className={`grid gap-6 transition-all duration-300 ${previewMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            <div className={`${previewMode ? 'hidden lg:block' : 'block'}`}>
              {contentTooLarge && (
                <div className="mb-3 text-red-500 text-sm text-center font-mono">
                  {CONTENT_MAX_LENGTH
                    ? `Content is too long to edit (max ${CONTENT_MAX_LENGTH} characters).`
                    : "Content is too large to edit in this field."}
                </div>
              )}

              <textarea
                name="content"
                value={editNote.content}
                onChange={handleInputChange}
                rows={16}
                maxLength={CONTENT_MAX_LENGTH}
                disabled={updateLoading || contentTooLarge}
                className="
                  w-full
                  rounded-xl
                  border-2 border-muted
                  px-4 py-3
                  font-mono text-sm
                  text-type-1
                  bg-black/20
                  focus:outline-none
                  focus:border-white/40
                  transition-all
                  resize-none
                  min-h-[400px]
                "
                style={
                  contentTooLarge
                    ? { background: "rgba(255,255,255,0.05)" }
                    : {}
                }
              />
            </div>

            {previewMode && (
                <div className="
                    h-full 
                    min-h-[400px]
                    p-8 
                    rounded-xl 
                    border-2 border-white/20 
                    bg-black/40 
                    backdrop-blur-md 
                    overflow-y-auto 
                    custom-scrollbar 
                    shadow-inner
                ">
                    {editNote.content?.trim() ? (
                        <MathContent content={editNote.content} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-type-3 font-mono opacity-50">
                            <p className="text-xs uppercase tracking-widest">No Content to Render</p>
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="
            rounded-xl
            px-5 py-4
            border border-muted
            shadow-xl
            glass-panel
            text-type-1
            font-mono
          "
        >
          <MathContent content={note.content} />
        </div>
      )}
    </div>
  );
};

export default NoteContent;

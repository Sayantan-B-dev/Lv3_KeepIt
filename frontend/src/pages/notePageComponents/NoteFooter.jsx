import React from "react";
import { saveAs } from "file-saver";

function sanitizeFilename(name) {
  return String(name || "note")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-\.]/g, "")
    .slice(0, 128) || "note";
}

const NoteFooter = ({ note, updateError, updateSuccess }) => {
  const handleDownloadMarkdown = () => {
    try {
      const content = note?.content || "";
      const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
      const filename = `${sanitizeFilename(note?.title)}.md`;
      saveAs(blob, filename);
    } catch (_) {}
  };

  return (
    <>
      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm italic">
          Viewing note <span className="font-bold">{note.title}</span>.
        </p>
        <div className="mt-3">
          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-2 rounded-full border border-black bg-white text-black text-sm font-semibold hover:bg-gray-100"
            type="button"
          >
            Download .md
          </button>
        </div>
      </div>
      {updateError && <div className="mt-2 text-red-500 text-center">{updateError}</div>}
      {updateSuccess && <div className="mt-2 text-green-600 text-center">{updateSuccess}</div>}
    </>
  );
};

export default NoteFooter;
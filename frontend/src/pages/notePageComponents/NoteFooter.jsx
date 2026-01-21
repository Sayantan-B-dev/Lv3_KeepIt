import React from "react";
import { saveAs } from "file-saver";
import DottedButton from "../../components/buttons/DottedButton";

function sanitizeFilename(name) {
  return (
    String(name || "note")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-\.]/g, "")
      .slice(0, 128) || "note"
  );
}

const NoteFooter = ({ note, updateError, updateSuccess }) => {
  const handleDownloadMarkdown = () => {
    try {
      const content = note?.content || "";
      const blob = new Blob([content], {
        type: "text/markdown;charset=utf-8",
      });
      const filename = `${sanitizeFilename(note?.title)}.md`;
      saveAs(blob, filename);
    } catch (_) {}
  };

  return (
    <>
      <div className="text-center font-mono mb-5">
        <p className="text-type-3 text-sm italic">
          Viewing note{" "}
          <span className="font-semibold text-type-1">
            {note.title}
          </span>
          .
        </p>

        <div className="mt-4 flex justify-center">
          <DottedButton onClick={handleDownloadMarkdown} text="Download .md"/>
            
        </div>
      </div>

      {updateError && (
        <div className="mt-3 text-red-500 text-center font-mono text-sm">
          {updateError}
        </div>
      )}

      {updateSuccess && (
        <div className="mt-3 text-green-500 text-center font-mono text-sm">
          {updateSuccess}
        </div>
      )}
    </>
  );
};

export default NoteFooter;

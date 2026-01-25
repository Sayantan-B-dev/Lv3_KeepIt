import { saveAs } from "file-saver";

/**
 * Sanitizes file names for download
 */
function sanitizeName(str, fallback = "note") {
    return String(str || fallback)
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_\-\.]/g, "")
        .slice(0, 128) || fallback;
}

/**
 * Exports a single note as a .md file
 * @param {Object} note - The note object containing title and content
 */
export const exportNoteAsMd = (note) => {
    if (!note) return;

    const title = note.title || "Untitled Note";
    const content = note.content || "";

    // Create a blob with the content
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });

    // Generate filename
    const filename = `${sanitizeName(title)}.md`;

    // Trigger download
    saveAs(blob, filename);
};

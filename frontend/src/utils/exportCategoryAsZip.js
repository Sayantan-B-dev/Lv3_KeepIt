import JSZip from "jszip";
import { saveAs } from "file-saver";
import axiosInstance from "@/api/axiosInstance";

function sanitizeName(str, fallback = "file") {
  return String(str || fallback)
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-\.]/g, "")
    .slice(0, 128) || fallback;
}

/**
 * 
 * @param {Object} category 
 * @param {Array} notes 
 * @param {Function} onProgress (optional) callback: ({ current, total, title }) => {}
 */
export async function exportCategoryAsZip(category, notes = [], onProgress) {
  try {
    const zip = new JSZip();
    const folderName = sanitizeName(category?.name, "category");
    const folder = zip.folder(folderName);

    const total = notes.length;
    let current = 0;

    for (const note of notes) {
      current++;
      if (onProgress) onProgress({ current, total, title: note.title });

      try {
        let content = note.content;

        // If content is missing, fetch full note data
        if (content === undefined || content === null) {
          const res = await axiosInstance.get(`/api/notes/${note._id}`);
          content = res.data?.content || "";
        }

        const fileName = sanitizeName(note.title, "note") + ".md";
        folder.file(fileName, String(content));
      } catch (err) {
        // Skip private or deleted notes (403/404)
        console.warn(`Skipping note ${note.title}:`, err.response?.data?.error || err.message);
        continue;
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${folderName}.zip`);
  } catch (err) {
    console.error("ZIP export failed:", err);
    throw err;
  }
}

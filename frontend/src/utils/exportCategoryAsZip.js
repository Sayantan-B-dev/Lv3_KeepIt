import JSZip from "jszip";
import { saveAs } from "file-saver";

function sanitizeName(str, fallback = "file") {
  return String(str || fallback)
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-\.]/g, "")
    .slice(0, 128) || fallback;
}

export async function exportCategoryAsZip(category, notes = []) {
  try {
    const zip = new JSZip();

    const folderName = sanitizeName(category?.name, "category");
    const folder = zip.folder(folderName);

    notes.forEach((note) => {
      const fileName = sanitizeName(note.title, "note") + ".md";
      folder.file(fileName, String(note.content || ""));
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${folderName}.zip`);
  } catch (err) {
    console.error("ZIP export failed:", err);
  }
}

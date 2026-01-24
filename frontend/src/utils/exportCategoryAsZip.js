import JSZip from "jszip";
import { saveAs } from "file-saver";
import axiosInstance from "@/api/axiosInstance";

/**
 * Sanitizes folder/file names for ZIP
 */
function sanitizeName(str, fallback = "file") {
    return String(str || fallback)
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_\-\.]/g, "")
        .slice(0, 128) || fallback;
}

/**
 * CONCURRENT FETCHING STRATEGY
 * Fetch contents of multiple notes in parallel with a concurrency limit.
 */
async function fetchNoteContents(noteMetadataList, onProgressUpdate) {
    const CONCURRENCY_LIMIT = 5;
    const total = noteMetadataList.length;
    const results = [];
    let currentCount = 0;

    // Clone list to use as a queue
    const queue = [...noteMetadataList];

    const worker = async () => {
        while (queue.length > 0) {
            const meta = queue.shift();
            if (!meta) continue;

            try {
                // Report progress BEFORE fetching to show user which one is active
                onProgressUpdate?.(currentCount + 1, total, meta.title);

                const res = await axiosInstance.get(`/api/notes/${meta._id}`);
                results.push({
                    ...meta,
                    content: res.data?.content || ""
                });
            } catch (err) {
                console.warn(`Failed to fetch content for note "${meta.title}":`, err.message);
                // We push it anyway without content so the user knows it exists in the archive list
                results.push({ ...meta, content: "(Content unavailable or private)" });
            } finally {
                currentCount++;
            }
        }
    };

    // Start pool of workers
    const workers = Array(Math.min(CONCURRENCY_LIMIT, total)).fill(null).map(worker);
    await Promise.all(workers);

    return results;
}

/**
 * THE COMPREHENSIVE EXPORTER
 * 1. Fetches ALL pages of metadata for the category.
 * 2. Fetches note contents in parallel.
 * 3. Organizes notes into parts (50 each) in the ZIP.
 */
export async function exportCategoryAsZip(category, initialNotes = [], onProgress, isOwner = false) {
    const categoryId = category?._id;
    if (!categoryId) throw new Error("Invalid Category ID");

    try {
        const zip = new JSZip();
        const folderName = sanitizeName(category.name, "category");
        const mainFolder = zip.folder(folderName);

        // --- PHASE 1: FETCH ALL METADATA ---
        if (onProgress) onProgress({ progress: 0, title: "Crawling note tree..." });

        const targetUrl = isOwner
            ? `/api/notes/category/${categoryId}`
            : `/api/notes/category/${categoryId}/public`;

        const limit = 100;
        let allMetadata = [];
        let page = 1;
        let hasMoreMetadata = true;

        while (hasMoreMetadata) {
            const res = await axiosInstance.get(targetUrl, { params: { page, limit } });
            const pageNotes = res.data.notes || [];
            allMetadata = [...allMetadata, ...pageNotes];

            const totalAvailable = res.data.total || 0;
            hasMoreMetadata = allMetadata.length < totalAvailable && pageNotes.length > 0;
            page++;

            if (onProgress) onProgress({
                progress: 0.05,
                title: `Indexed ${allMetadata.length} of ${totalAvailable} note headers...`
            });
        }

        // --- PHASE 2: CONCURRENT CONTENT FETCHING ---
        const fullNotes = await fetchNoteContents(allMetadata, (done, total, title) => {
            if (onProgress) onProgress({
                progress: 0.1 + (done / total) * 0.8, // Reserve space for metadata and zipping
                title: `Extracting: ${title}`
            });
        });

        // --- PHASE 3: CHUNKING & BUILDING ZIP ---
        if (onProgress) onProgress({ progress: 0.9, title: "Compiling archive stream..." });

        const CHUNK_SIZE = 100;
        fullNotes.forEach((note, index) => {
            const globalIndex = index + 1;
            const partNumber = Math.ceil(globalIndex / CHUNK_SIZE);

            // Determine folder path
            let targetFolder = mainFolder;
            if (fullNotes.length > CHUNK_SIZE) {
                const partFolderName = `Part_${partNumber}`;
                targetFolder = mainFolder.folder(partFolderName);
            }

            const fileName = sanitizeName(note.title, "note") + ".md";
            targetFolder.file(fileName, String(note.content));
        });

        // --- PHASE 4: DOWNLOAD ---
        if (onProgress) onProgress({ progress: 0.95, title: "Packaging archive..." });
        const blob = await zip.generateAsync({ type: "blob" });
        if (onProgress) onProgress({ progress: 1, title: "Archive Ready. Downloading..." });

        saveAs(blob, `${folderName}.zip`);

        return true;
    } catch (err) {
        console.error("COMPREHENSIVE EXPORT ERROR:", err);
        throw err;
    }
}

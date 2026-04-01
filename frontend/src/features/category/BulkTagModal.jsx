import React, { useState, useEffect } from "react";
import SimpleModal from "@/components/ui/SimpleModal";
import TagInput from "@/components/common/TagInput";
import { DottedButton } from "@/components/ui/buttons";
import axiosInstance from "@/api/axiosInstance";

const textAreaStyle = "textAreaStyle"; // Reusing the same style

const BulkTagModal = ({ open, onClose, selectedNotes, category, clearSelection, loggedInUser }) => {
    const isPro = loggedInUser?.isPro || loggedInUser?.isPremium;
    const [tags, setTags] = useState([]);
    const [status, setStatus] = useState("idle"); // idle, processing, complete, error
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [etr, setEtr] = useState(null);

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setTags([]);
            setStatus("idle");
            setProgress(0);
            setResults(null);
            setEtr(null);
        }
    }, [open]);

    const handleBulkTag = async () => {
        if (!tags || tags.length === 0) {
            return;
        }

        setStatus("processing");
        setProgress(0);
        const startTime = Date.now();

        const noteIds = selectedNotes.map(n => typeof n === 'string' ? n : n._id);
        const totalNotes = noteIds.length;

        // Batch configuration (though backend supports single array, we batch to give UI updates)
        const BATCH_SIZE = 50;
        let successCount = 0;
        let failCount = 0;
        const failedNotes = [];

        for (let i = 0; i < totalNotes; i += BATCH_SIZE) {
            const batchIds = noteIds.slice(i, i + BATCH_SIZE);

            try {
                const res = await axiosInstance.post("/api/notes/bulk-tag", {
                    noteIds: batchIds,
                    tags: tags,
                });
                successCount += batchIds.length; // Approximate, relying on backend
            } catch (err) {
                console.error("Batch error:", err);
                failCount += batchIds.length;
                failedNotes.push(...batchIds);
            }

            const currentProcessed = Math.min(i + BATCH_SIZE, totalNotes);
            setProgress((currentProcessed / totalNotes) * 100);

            // Calculate ETR
            const elapsed = Date.now() - startTime;
            const timePerNote = elapsed / currentProcessed;
            const remainingNotes = totalNotes - currentProcessed;
            setEtr(Math.ceil((timePerNote * remainingNotes) / 1000));
        }

        setStatus("complete");
        setResults({ successCount, failCount, failedNotes });
        if (clearSelection) clearSelection();
    };

    const downloadReport = () => {
        if (!results) return;

        const content = `
Bulk Tagging Report
===================
Date: ${new Date().toLocaleString()}
Category: ${category?.name || "Unknown"}
Tags Applied: ${tags.join(", ")}

Total Attempted: ${selectedNotes.length}
Successful: ${results.successCount}
Failed: ${results.failCount}

Failed Note IDs:
${results.failedNotes.length > 0 ? results.failedNotes.join("\n") : "None"}
        `;

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bulk-tag-report-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <SimpleModal open={open} onClose={status === "processing" ? () => { } : onClose} title="Bulk Tag Notes">
            <div className="flex flex-col gap-6 p-2 font-mono">
                {status === "idle" && (
                    <>
                        {/* Info Section */}
                        <p className="text-sm text-type-2">
                            You are about to tag{" "}
                            <strong className="text-type-1">
                                {selectedNotes.length}
                            </strong>{" "}
                            notes.
                        </p>

                        {/* Documentation Section */}
                        <div className="mt-3 text-xs text-type-2 space-y-1 font-mono">
                            <p><strong>doc:</strong></p>
                            <p>step1.. make sure you preselected the md file you want to tag</p>
                            <p>step2.. write a tag and press Enter to register the tag</p>
                            <p>step3.. press start tagging</p>
                        </div>

                        {/* Tag Input Section */}
                        <div className="mt-4">
                            <label className="block text-type-2 font-mono mb-2">
                                Tags to add
                            </label>

                            <TagInput
                                value={tags}
                                onChange={setTags}
                                textAreaStyle="w-full bg-type-2 border border-muted p-3 rounded-lg text-type-1"
                                placeholder="Add tags (Enter or comma)"
                            />
                        </div>

                        {/* Actions Section */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-muted rounded-lg text-type-2 hover:bg-white/10"
                            >
                                Cancel
                            </button>

                            <DottedButton
                                text="Start Tagging"
                                onClick={handleBulkTag}
                                disabled={tags.length === 0} // prevents empty submission
                            />
                        </div>
                    </>
                )}

                {status === "processing" && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden border border-muted">
                            <div
                                className="bg-blue-500 h-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-type-1">{Math.round(progress)}% Complete</p>
                        {etr !== null && (
                            <p className="text-sm text-type-3">Estimated time remaining: {etr} seconds</p>
                        )}
                    </div>
                )}

                {status === "complete" && results && (
                    <div className="flex flex-col gap-4 py-4">
                        <div className="bg-type-2 border border-muted rounded-lg p-4">
                            <h3 className="text-lg text-type-1 mb-2">Operation Complete</h3>
                            <p className="text-green-400">Successfully tagged: {results.successCount}</p>
                            {results.failCount > 0 && (
                                <p className="text-red-400">Errors: {results.failCount}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={downloadReport}
                                className="px-4 py-2 border border-muted rounded-lg text-type-1 hover:bg-white/10"
                            >
                                Download Report (.txt)
                            </button>
                            <DottedButton
                                text="Close"
                                onClick={onClose}
                            />
                        </div>
                    </div>
                )}
            </div>
        </SimpleModal>
    );
};

export default BulkTagModal;

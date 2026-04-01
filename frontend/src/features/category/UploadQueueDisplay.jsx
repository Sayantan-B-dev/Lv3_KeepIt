import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdUploadFile, MdCheckCircle, MdPlayArrow, MdDownload, MdClearAll, MdErrorOutline } from "react-icons/md";
import { generateUploadLog, downloadTextFile } from "@/utils/generateUploadLog";

const UploadQueueDisplay = ({ getUploadQueue, clearUploadQueue, resumeQueue, categoryId, uploadReport, clearReport, categoryName }) => {
    const [queue, setQueue] = useState([]);
    const [isExpanded, setIsExpanded] = useState(true);

    // Poll the queue every 500ms to update the display
    useEffect(() => {
        const updateQueue = () => {
            const currentQueue = getUploadQueue();
            // Filter queue items for this category
            const categoryQueue = currentQueue.filter(item => item.categoryId === categoryId);
            setQueue(categoryQueue);
        };

        updateQueue();
        const interval = setInterval(updateQueue, 500);
        return () => clearInterval(interval);
    }, [getUploadQueue, categoryId]);

    const removeFromQueue = (index) => {
        const currentQueue = getUploadQueue();
        const globalIndex = currentQueue.findIndex(
            (item, i) => item.categoryId === categoryId &&
                currentQueue.filter(q => q.categoryId === categoryId).indexOf(item) === index
        );

        if (globalIndex !== -1) {
            currentQueue.splice(globalIndex, 1);
            localStorage.setItem("mdUploadQueue", JSON.stringify(currentQueue));
            setQueue(currentQueue.filter(item => item.categoryId === categoryId));
        }
    };

    const clearAll = () => {
        const currentQueue = getUploadQueue();
        const otherCategoryQueue = currentQueue.filter(item => item.categoryId !== categoryId);
        localStorage.setItem("mdUploadQueue", JSON.stringify(otherCategoryQueue));
        setQueue([]);
    };

    const handleDownloadReport = () => {
        const log = generateUploadLog(uploadReport, categoryName || "Unknown");
        const filename = `upload-report-${new Date().getTime()}.txt`;
        downloadTextFile(log, filename);
    };

    const successCount = uploadReport.filter(r => r.status === "success").length;
    const errorCount = uploadReport.filter(r => r.status === "error").length;

    if (queue.length === 0 && uploadReport.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 border border-muted rounded-lg bg-type-b1 shadow-lg overflow-hidden mt-5"
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-3 bg-type-b2 cursor-pointer hover:bg-white/5 transition"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
                    <MdUploadFile className="text-blue-400" size={20} />
                    <span className="font-semibold text-type-1">
                        Upload Queue ({queue.length})
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Resume / Start Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            resumeQueue();
                        }}
                        className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition flex items-center gap-1"
                        title="Resume Uploads"
                    >
                        <MdPlayArrow size={14} /> Start / Resume
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            clearAll();
                        }}
                        className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                    >
                        Clear All
                    </button>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        ▼
                    </motion.div>
                </div>
            </div>

            {/* Queue Items */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                            {queue.map((item, index) => (
                                <motion.div
                                    key={`${item.name}-${index}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center justify-between p-2 rounded bg-type-b2 border border-muted hover:border-muted2 transition group"
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {index === 0 ? (
                                            <div className="relative">
                                                <MdUploadFile className="text-green-400 animate-pulse" size={18} />
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                                            </div>
                                        ) : (
                                            <MdCheckCircle className="text-gray-400" size={18} />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-type-1 truncate font-mono">
                                                {item.name.replace(/\.md$/i, "")}
                                            </p>
                                            <p className="text-xs text-type-3">
                                                {index === 0 ? "Uploading..." : `Position ${index + 1}`}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromQueue(index)}
                                        disabled={index === 0}
                                        className="p-1 rounded hover:bg-red-500/20 text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition opacity-0 group-hover:opacity-100"
                                        title={index === 0 ? "Cannot remove item being uploaded" : "Remove from queue"}
                                    >
                                        <MdClose size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Summary Section */}
            {queue.length === 0 && uploadReport.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-type-b2/50 border-t border-muted flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-green-400 font-mono text-sm">
                            <MdCheckCircle size={18} />
                            <span>{successCount} Success</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-red-400 font-mono text-sm">
                            <MdErrorOutline size={18} />
                            <span>{errorCount} Failed</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownloadReport}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm font-mono transition border border-blue-500/30"
                        >
                            <MdDownload size={18} /> Download Results (.txt)
                        </button>
                        <button
                            onClick={clearReport}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 text-type-3 hover:text-white hover:bg-white/10 rounded-lg text-sm font-mono transition border border-muted"
                        >
                            <MdClearAll size={18} /> Dismiss
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default UploadQueueDisplay;

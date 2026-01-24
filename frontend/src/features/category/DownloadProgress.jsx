import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileDownload, FaSpinner } from "react-icons/fa";

const DownloadProgress = ({ isExporting, progress, currentTitle }) => {
    const percentage = Math.round(progress * 100);

    return (
        <AnimatePresence>
            {isExporting && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    className="fixed bottom-12 right-12 z-[200]"
                >
                    <div className="glass-panel border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-10 rounded-2xl flex flex-col items-center gap-6 min-w-[400px] bg-black/90 backdrop-blur-3xl">
                        <div className="relative">
                            <div className="p-5 bg-white/5 rounded-full text-white/70 border border-white/10">
                                <FaFileDownload size={32} />
                            </div>
                            <div className="absolute inset-0 animate-pulse bg-white/10 blur-2xl rounded-full" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-type-1 font-mono font-bold text-xl uppercase tracking-[0.2em]">
                                Exporting Data
                            </h3>
                            <p className="text-type-3 text-xs font-mono mt-2 truncate max-w-[320px] italic opacity-80">
                                {currentTitle || "Indexing data blocks..."}
                            </p>
                        </div>

                        <div className="w-full">
                            <div className="flex justify-between items-center mb-3 font-mono text-xs">
                                <span className="text-type-2 uppercase tracking-widest opacity-60">Bitstream Progress</span>
                                <span className="text-type-1 font-extrabold">{percentage}%</span>
                            </div>

                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <motion.div
                                    className="h-full bg-white/60 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ type: "spring", stiffness: 40, damping: 20 }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-white/40 text-[10px] font-mono tracking-[0.3em] uppercase">
                            <FaSpinner className="animate-spin" size={12} />
                            compiling markdown buffer
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DownloadProgress;

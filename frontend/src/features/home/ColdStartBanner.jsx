import React from "react";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";

const ColdStartBanner = () => {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="w-full mb-6 overflow-hidden"
        >
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 animate-pulse" />

                <div className="flex items-center gap-5 relative z-10">
                    <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 animate-bounce">
                        <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-lg font-bold text-white font-mono tracking-tight">
                            Waking up the server...
                        </h4>
                        <p className="text-sm text-blue-200/70 font-mono">
                            The backend is warming up from a power-save state (Render free tier).
                            This usually takes about 30-50 seconds.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10 bg-black/20 p-3 rounded-xl border border-white/5">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    <span className="text-xs font-mono text-blue-200 uppercase tracking-widest font-bold">
                        Stay with us
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ColdStartBanner;

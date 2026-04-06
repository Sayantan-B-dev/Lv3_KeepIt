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
            <div className="p-6 rounded-[3rem] border border-white/20 bg-black/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 animate-pulse" />

                <div className="flex items-center gap-5 relative z-10">
                    <div className="p-3 rounded-full bg-white/10 text-white animate-bounce border border-white/20">
                        <Zap className="w-6 h-6 fill-current" />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-lg font-bold text-white font-mono tracking-tight">
                            Waking up the server...
                        </h4>
                        <p className="text-sm text-white/50 font-mono italic">
                            The backend is warming up from a power-save state (Render free tier).
                            This usually takes about 30-50 seconds.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10 bg-black/20 p-3 rounded-full border border-white/20">
                    <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
                    <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest font-bold">
                        Stay with us
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ColdStartBanner;

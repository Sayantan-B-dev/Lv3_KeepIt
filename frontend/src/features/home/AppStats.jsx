import React from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles, Zap, Lock } from "lucide-react";

const stats = [
    {
        icon: <Zap className="w-5 h-5 text-white/40" />,
        label: "Super Fast",
        value: "Vite Powered",
        desc: "Lightning speed performance"
    },
    {
        icon: <Lock className="w-5 h-5 text-white/40" />,
        label: "Security",
        value: "Encrypted",
        desc: "Your data stays private"
    },
    {
        icon: <Shield className="w-5 h-5 text-white/40" />,
        label: "Safe Space",
        value: "Isolated",
        desc: "Unique workspace per user"
    },
    {
        icon: <Sparkles className="w-5 h-5 text-white/40" />,
        label: "UI/UX",
        value: "Modern",
        desc: "Beautifully crafted design"
    }
];

const AppStats = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5 w-full">
            {stats.map((item, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 rounded-2xl border border-white/20 bg-black/40 flex flex-col gap-3 transition-all cursor-default group hover:bg-black/60 hover:border-white/40"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg border border-white/10 group-hover:border-white/30 transition-colors">
                            {item.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-type-3 font-bold">
                                {item.label}
                            </span>
                            <span className="text-sm font-bold text-type-1 font-mono">
                                {item.value}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-type-3 font-mono leading-relaxed">
                        {item.desc}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

export default AppStats;

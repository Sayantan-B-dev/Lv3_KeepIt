import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Hash, Layers, Users } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import CipherNumber from "./CipherNumber";

const AppStats = ({ isOffline }) => {
    const [metrics, setMetrics] = useState({
        totalNotes: 0,
        totalTags: 0,
        totalCategories: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Try to get fresh metrics first
                const response = await axiosInstance.get('/api/global/metrics');
                setMetrics(response.data);
            } catch (error) {
                console.error("Error fetching fresh metrics:", error);
                // If it fails, try to get initial data (cached stats)
                try {
                    const fallback = await axiosInstance.get('/api/global/initial-data');
                    setMetrics(fallback.data);
                } catch (fallbackError) {
                    console.error("Critical: Failed to fetch any metrics.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const stats = [
        {
            icon: <BookOpen className="w-4 h-4 text-white/40" />,
            label: "Public Notes",
            value: metrics.totalNotes,
            desc: "Shared knowledge"
        },
        {
            icon: <Hash className="w-4 h-4 text-white/40" />,
            label: "Global Tags",
            value: metrics.totalTags,
            desc: "Organized data"
        },
        {
            icon: <Layers className="w-4 h-4 text-white/40" />,
            label: "Categories",
            value: metrics.totalCategories,
            desc: "Diverse topics"
        },
        {
            icon: <Users className="w-4 h-4 text-white/40" />,
            label: "Creators",
            value: metrics.totalUsers,
            desc: "Active users"
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 w-full">
            {stats.map((item, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 md:p-4 rounded-2xl border border-white/10 bg-black/40 flex flex-col gap-2 transition-all cursor-default group hover:bg-black/60 hover:border-white/20"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg border border-white/5 group-hover:border-white/20 transition-colors">
                            {item.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#666] font-bold">
                                {item.label}
                            </span>
                            <span className="text-sm font-bold text-white font-mono flex items-center gap-1">
                                {loading ? "..." : <CipherNumber value={item.value} isOffline={isOffline} />}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default AppStats;

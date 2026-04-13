import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Hash, Layers, Users } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

const AppStats = () => {
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
                const response = await axiosInstance.get('/api/global/metrics');
                setMetrics(response.data);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const stats = [
        {
            icon: <BookOpen className="w-5 h-5 text-white/40" />,
            label: "Public Notes",
            value: loading ? "..." : metrics.totalNotes,
            desc: "Knowledge shared so far"
        },
        {
            icon: <Hash className="w-5 h-5 text-white/40" />,
            label: "Global Tags",
            value: loading ? "..." : metrics.totalTags,
            desc: "Organized by interest"
        },
        {
            icon: <Layers className="w-5 h-5 text-white/40" />,
            label: "Categories",
            value: loading ? "..." : metrics.totalCategories,
            desc: "Diverse topics available"
        },
        {
            icon: <Users className="w-5 h-5 text-white/40" />,
            label: "Creators",
            value: loading ? "..." : metrics.totalUsers,
            desc: "Growing community"
        }
    ];

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

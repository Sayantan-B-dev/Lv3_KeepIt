import React from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, Crown } from "lucide-react";

const ProComparison = () => {
    const features = [
        { name: "Global Public Notes", free: true, pro: true },
        { name: "Private Notes", free: false, pro: true },
        { name: "Markdown Import", free: "Limited", pro: "Unlimited" },
        { name: "Custom Categories", free: "Up to 5", pro: "Unlimited" },
        { name: "Bulk Export (ZIP)", free: false, pro: true },
        { name: "Priority Support", free: false, pro: true },
        { name: "Advanced Analytics", free: false, pro: true },
    ];

    return (
        <div className="w-full my-10 py-10 px-6 border border-white/10 rounded-3xl bg-black/20 backdrop-blur-sm shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none" />
            
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-black text-white font-mono uppercase italic tracking-tighter mb-4">
                    Elevate Your Knowledge
                </h2>
                <p className="text-type-3 font-mono opacity-70">Compare our Free and Pro features.</p>
            </div>

            <div className="max-w-4xl mx-auto overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="py-6 px-4 font-mono text-type-3 uppercase tracking-widest text-[10px]">Feature</th>
                            <th className="py-6 px-4 font-mono text-white/80 uppercase tracking-widest text-center text-[10px]">
                                <div className="flex flex-col items-center gap-1">
                                    <Zap className="w-4 h-4 text-white/40" />
                                    <span>Free</span>
                                </div>
                            </th>
                            <th className="py-6 px-4 font-mono text-emerald-400 uppercase tracking-widest text-center text-[10px]">
                                <div className="flex flex-col items-center gap-1">
                                    <Crown className="w-4 h-4 text-yellow-500" />
                                    <span className="text-yellow-500">Pro</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {features.map((feature, idx) => (
                            <motion.tr 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group/row hover:bg-white/[0.02] transition-colors"
                            >
                                <td className="py-5 px-4 text-sm font-mono text-white/80 group-hover/row:text-white">{feature.name}</td>
                                <td className="py-5 px-4 text-center">
                                    {typeof feature.free === "boolean" ? (
                                        feature.free ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-red-500/50 mx-auto" />
                                    ) : (
                                        <span className="text-xs font-mono text-white/40 italic">{feature.free}</span>
                                    )}
                                </td>
                                <td className="py-5 px-4 text-center">
                                    {typeof feature.pro === "boolean" ? (
                                        feature.pro ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-red-500/50 mx-auto" />
                                    ) : (
                                        <span className="text-xs font-mono text-emerald-400 italic font-bold">{feature.pro}</span>
                                    )}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-12 text-center">
                <button 
                  onClick={() => window.location.href = '/upgrade'}
                  className="px-10 py-3 rounded-full bg-white text-black font-black font-mono uppercase italic text-sm hover:scale-105 transition-transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    Get Pro Access
                </button>
            </div>
        </div>
    );
};

export default ProComparison;

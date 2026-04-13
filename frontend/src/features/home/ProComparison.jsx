import React from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, Crown, ArrowRight, ShieldX } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";

const ProComparison = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isPro = user?.isPro || user?.isPremium;

    const features = [
        { name: "Public Note Storage", free: true, pro: true },
        { name: "Private Note Vault", free: false, pro: true },
        { name: "Upload Speed (Notes/hr)", free: "50", pro: "2,000" },
        { name: "Concurrent Uploads", free: "1 Stream", pro: "5 Parallel" },
        { name: "Batch Sync Delay", free: "5s", pro: "3s" },
        { name: "Category ZIP Export", free: false, pro: true },
        { name: "Managed Bulk Tagging", free: false, pro: true },
        { name: "Lifetime Pro Badge", free: false, pro: true },
    ];

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel your Pro membership?")) return;
        try {
            await axiosInstance.post("/api/payment/cancel");
            toast.info("Membership cancelled.");
            window.location.reload();
        } catch (err) {
            toast.error("Failed to cancel membership.");
        }
    };

    return (
        <div className="w-full my-10 py-12 px-6 border-1 border-white/20 rounded-3xl bg-transparent backdrop-blur-sm relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-6xl font-black text-white font-mono uppercase italic tracking-tighter mb-4">
                        {isPro ? "Your Pro Status" : "Go Beyond Static"}
                    </h2>
                    <p className="text-type-3 font-mono text-xs uppercase tracking-[0.3em] opacity-60">
                        {isPro ? "Premium features active" : "Unlock High-Performance Infrastructure"}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-white/10">
                                <th className="py-6 px-4 font-mono text-type-3 uppercase tracking-widest text-[10px]">Tier Feature</th>
                                <th className="py-6 px-4 font-mono text-white/40 uppercase tracking-widest text-center text-[10px]">Standard</th>
                                <th className="py-6 px-4 font-mono text-white uppercase tracking-widest text-center text-[10px]">
                                    <div className="flex flex-col items-center gap-1">
                                        <Crown className="w-4 h-4" />
                                        <span>Pro Access</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-b-2 border-white/10 divide-white/5">
                            {features.map((feature, idx) => (
                                <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors">
                                    <td className="py-5 px-4 text-sm font-mono text-type-2 group-hover/row:text-white transition-colors">{feature.name}</td>
                                    <td className="py-5 px-4 text-center">
                                        {typeof feature.free === "boolean" ? (
                                            feature.free ? <Check className="w-4 h-4 text-white/20 mx-auto" /> : <X className="w-4 h-4 text-white/5 mx-auto" />
                                        ) : (
                                            <span className="text-xs font-mono text-white/20 italic">{feature.free}</span>
                                        )}
                                    </td>
                                    <td className="py-5 px-4 text-center bg-white/[0.02]">
                                        {typeof feature.pro === "boolean" ? (
                                            feature.pro ? <Check className="w-4 h-4 text-white mx-auto" /> : <X className="w-4 h-4 text-white/5 mx-auto" />
                                        ) : (
                                            <span className="text-xs font-mono text-white font-black italic">{feature.pro}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-12 flex flex-col items-center gap-6">
                    {!isPro ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-black text-white font-mono italic">₹99 <span className="text-xs not-italic font-normal opacity-50">One-time Access</span></div>
                            </div>
                            <button 
                                onClick={() => navigate('/upgrade')}
                                className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-black font-mono uppercase italic text-sm hover:bg-zinc-200 transition-all rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95 border-b-4 border-zinc-400"
                            >
                                Get Lifetime Pro Access
                                <Zap className="w-4 h-4 fill-current" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <button 
                                onClick={handleCancel}
                                className="group flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white/10 text-white/40 hover:text-white hover:border-white transition-all rounded-xl font-mono font-bold uppercase text-xs tracking-widest active:scale-95"
                            >
                                <ShieldX className="w-4 h-4" />
                                Cancel Pro Membership
                            </button>
                            <p className="text-[10px] font-mono text-type-3 uppercase tracking-tighter italic">Warning: Cancellation removes all premium benefits instantly.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Decorative */}
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none select-none">
                <Crown size={300} strokeWidth={0.5} />
            </div>
        </div>
    );
};

export default ProComparison;

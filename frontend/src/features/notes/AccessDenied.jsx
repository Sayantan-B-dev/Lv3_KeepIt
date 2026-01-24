import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = ({ error }) => {
    const navigate = useNavigate();
    const isPrivateErr = error?.toLowerCase().includes("private") || error?.toLowerCase().includes("authorized");

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-12 glass-panel border border-red-500/20 rounded-3xl mx-auto max-w-2xl mt-20 animate-in fade-in zoom-in duration-300">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
                <div className="relative bg-black/40 border border-red-500/30 p-8 rounded-full text-red-500 shadow-2xl">
                    <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18,8H17V6A5,5,0,0,0,7,6V8H6a2,2,0,0,0-2,2V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V10A2,2,0,0,0,18,8ZM9,6a3,3,0,0,1,6,0V8H9ZM18,20H6V10H18Z" />
                        <circle cx="12" cy="15" r="1.5" />
                    </svg>
                </div>
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                {isPrivateErr ? "Access Restricted" : "Note Unavailable"}
            </h2>

            <p className="text-red-200/70 font-mono text-lg mb-10 max-w-md mx-auto leading-relaxed">
                {isPrivateErr
                    ? "You cannot see this doc file. This content has been set to private by the owner."
                    : error}
            </p>

            <button
                onClick={() => navigate(-1)}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-mono transition-all hover:scale-105 active:scale-95"
            >
                &larr; Return to Safety
            </button>
        </div>
    );
};

export default AccessDenied;

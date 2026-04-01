import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Send, CheckCircle, ArrowLeft } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "react-toastify";

const Upgrade = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.warn("Please provide a reason for the upgrade.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/api/auth/pro-upgrade-request", { reason });
      setSubmitted(true);
      toast.success("Request sent to administrator!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-zinc-900 border border-white/10 p-10 rounded-3xl text-center shadow-2xl glass-panel"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-type-1 font-mono mb-4 italic tracking-tighter">SUCCESS!</h1>
          <p className="text-type-2 font-mono text-sm leading-relaxed mb-8">
            Your request has been beamed to the administrator. You'll receive a confirmation email once your Pro access is granted.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-type-1 rounded-xl transition-all font-mono text-sm"
          >
            Return to Base
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass-panel"
      >
        <div className="p-8 sm:p-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-type-3 hover:text-type-1 transition-colors mb-8 font-mono text-xs uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Category
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
              <Crown className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-type-1 font-mono italic tracking-tighter uppercase underline-animation">
              Pro Access Request
            </h1>
          </div>

          <p className="text-type-2 font-mono text-sm mb-10 leading-relaxed max-w-lg">
            Request manual authorization for Pro features. An admin will review your request and grant access via secure encrypted channel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-type-3 uppercase tracking-widest pl-1">
                Reason for Upgrade / Usage Intent
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly explain your need for increased limits or ZIP exports..."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-type-1 font-mono text-sm focus:outline-none focus:border-yellow-500/50 transition-colors custom-scrollbar"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold font-mono rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                "TRANSMITTING..."
              ) : (
                <>
                  TRANSMIT REQUEST
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Upgrade;

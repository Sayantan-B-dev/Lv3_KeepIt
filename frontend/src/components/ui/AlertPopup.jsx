import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const AlertPopup = ({
  isOpen,
  title = "SYSTEM ALERT",
  message = "Are you sure you want to continue?",
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  onConfirm,
  onClose,
  type = "warning",
  loading = false,
}) => {
  const accentClass = type === "danger" ? "text-white" : "text-white/90";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md bg-type-b4 border-2 border-white/30 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] p-7 text-center font-mono"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl border-2 border-white/10 bg-white/[0.02]">
                <AlertTriangle className={`w-10 h-10 ${accentClass}`} />
              </div>
            </div>

            <h3 className="text-lg font-black text-white italic tracking-tighter uppercase underline decoration-white/20 underline-offset-8">
              {title}
            </h3>
            <p className="mt-5 text-[11px] text-white/55 uppercase tracking-[0.18em] font-bold leading-loose">
              {message}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 border-2 border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all rounded-xl font-mono font-bold uppercase text-[11px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-3 bg-white text-black font-black uppercase italic text-[11px] tracking-widest rounded-xl border-b-4 border-zinc-400 hover:bg-zinc-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "PROCESSING..." : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertPopup;

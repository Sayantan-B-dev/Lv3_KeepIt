import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, X, WifiOff } from "lucide-react";

const BackendStatus = () => {
  const [status, setStatus] = useState("connecting"); // connecting, connected, offline
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const healthUrl = `${import.meta.env.VITE_API_BASE_URL}/api/health`;
    
    const checkHealth = async () => {
      try {
        const response = await fetch(healthUrl, { cache: 'no-store' });
        if (response.ok) {
          setStatus("connected");
        } else {
          setStatus("offline");
        }
      } catch (error) {
        setStatus("offline");
      }
    };

    checkHealth();

    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed bottom-6 right-6 z-[9999]"
        >
          <div className="flex items-center gap-4 bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-2 pl-4 pr-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
            <div className="flex items-center gap-3">
              {status === "connecting" && (
                <>
                  <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                  <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest font-black">
                    Waking up Backend
                  </span>
                </>
              )}
              {status === "connected" && (
                <>
                  <div className="relative">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 relative z-10" />
                    <motion.div 
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 bg-emerald-400/40 rounded-full"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">
                    Backend Live
                  </span>
                </>
              )}
              {status === "offline" && (
                <>
                  <WifiOff className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-black">
                    Cloud Offline
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => setVisible(false)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition-all duration-300 text-white/30 hover:text-white group-hover:bg-white/5"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackendStatus;

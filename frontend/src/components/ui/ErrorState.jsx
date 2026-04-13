import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, RefreshCw, AlertTriangle, ShieldAlert, ArrowLeft } from "lucide-react";
import { DottedButton } from "@/components/ui/buttons";

/**
 * A unified, high-aesthetic error state component.
 * Strictly using black & white palette and existing project button styles.
 */
const ErrorState = ({ 
  title = "SYSTEM ALERT", 
  message = "An unexpected error occurred while processing your request.", 
  onRetry, 
  onBack,
  type = "error", // 'error', 'access', 'not-found'
  actionText = "RETRY_CONTEXT"
}) => {
  const navigate = useNavigate();

  const handleHome = () => navigate("/");
  const handleBack = onBack || (() => navigate(-1));

  const getIcon = () => {
    switch (type) {
      case "access":
        return <ShieldAlert className="w-12 h-12 text-white/80" />;
      case "not-found":
        return <AlertTriangle className="w-12 h-12 text-white/40" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-white/60" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 relative overflow-hidden font-mono">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full bg-type-b4 border-2 border-white/40 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden relative z-10 p-8 text-center backdrop-blur-md"
      >
        <div className="flex justify-center mb-8">
          <div className="p-5 rounded-2xl border-2 border-white/5 bg-white/[0.02]">
            {getIcon()}
          </div>
        </div>

        <div className="space-y-2 mb-10">
          <h1 className="text-xl font-black text-white italic tracking-tighter uppercase underline decoration-white/20 underline-offset-8">
            {title}
          </h1>
          <p className="text-[11px] text-white/50 uppercase tracking-[0.2em] font-bold leading-loose max-w-[280px] mx-auto mt-6">
            {message}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {onRetry && (
            <div className="w-full">
               <DottedButton 
                text={actionText} 
                onClick={onRetry} 
                style={{ width: '100%', fontSize: '13px', letterSpacing: '0.15em' }}
              />
            </div>
          )}

          <div className="w-full">
            <DottedButton 
                text="RETURN_HOME" 
                onClick={handleHome} 
                style={{ width: '100%', fontSize: '13px', letterSpacing: '0.15em', background: 'rgba(255,255,255,0.05)' }}
            />
          </div>

          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 py-2 text-white/40 hover:text-white transition-all uppercase italic text-[11px] font-black tracking-widest mt-2 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            GO BACK
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
            <div className="h-px bg-white/40 flex-1" />
            <p className="text-[9px] text-white/30 font-mono uppercase tracking-[0.3em] font-black">
                {type}_TRACE
            </p>
            <div className="h-px bg-white/40 flex-1" />
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorState;

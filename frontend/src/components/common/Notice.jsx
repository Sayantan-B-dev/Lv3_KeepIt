// frontend/src/components/common/Notice.jsx
import { useState } from "react";
import { X } from "lucide-react";

export default function Notice({
  message,
  variant = "info", // info | warning | success | error
  dismissible = true,
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const variants = {
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-400/30",
      text: "text-blue-200",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-400/30",
      text: "text-yellow-200",
    },
    success: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-400/30",
      text: "text-emerald-200",
    },
    error: {
      bg: "bg-red-500/10",
      border: "border-red-400/30",
      text: "text-red-200",
    },
  };

  const style = variants[variant] || variants.info;

  return (
    <div
      className={`w-full border border-muted ${style.border} ${style.bg} backdrop-blur-md mb-5`}
    >
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-3">
        <p className={`text-sm text-center ${style.text}`}>{message}</p>
{/* 
        {dismissible && (
          <button
            onClick={() => setVisible(false)}
            className="text-xs opacity-70 hover:opacity-100 transition border border-muted rounded-full p-1"
            aria-label="Dismiss notice"
          >
            <X size={16} />
          </button>
        )} */}
      </div>
    </div>
  );
}

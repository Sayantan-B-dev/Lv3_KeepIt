import { toast } from "react-hot-toast";

const baseStyle = {
  borderRadius: "14px",
  padding: "14px 18px",
  fontSize: "0.9rem",
  fontWeight: 500,
  backdropFilter: "blur(10px)",
};

export const successToast = (msg) =>
  toast.success(msg, {
    style: {
      ...baseStyle,
      background: "linear-gradient(135deg, #1d976c, #93f9b9)",
      color: "#06281a",
      boxShadow: "0 10px 30px rgba(29,151,108,0.35)",
    },
    icon: "✓",
  });

export const errorToast = (msg) =>
  toast.error(msg, {
    style: {
      ...baseStyle,
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      color: "#2b0505",
      boxShadow: "0 10px 30px rgba(255,65,108,0.4)",
    },
    icon: "⚠",
  });

export const infoToast = (msg) =>
  toast(msg, {
    style: {
      ...baseStyle,
      background: "linear-gradient(135deg, #141e30, #243b55)",
      color: "#e6f0ff",
      boxShadow: "0 10px 30px rgba(20,30,48,0.5)",
    },
    icon: "ℹ",
  });

import { toast } from "react-toastify";

const baseOptions = {
  className: "premium-toast premium-toast--default",
  bodyClassName: "premium-toast__body",
  progressClassName: "premium-toast__progress",
};

export const successToast = (msg) =>
  toast.success(msg, {
    ...baseOptions,
    className: "premium-toast premium-toast--success",
    icon: "✓",
  });

export const errorToast = (msg) =>
  toast.error(msg, {
    ...baseOptions,
    className: "premium-toast premium-toast--error",
    icon: "⚠",
  });

export const infoToast = (msg) =>
  toast.info(msg, {
    ...baseOptions,
    className: "premium-toast premium-toast--info",
    icon: "ℹ",
  });

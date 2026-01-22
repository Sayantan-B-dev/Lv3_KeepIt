function ConfirmPopUp({
  open,
  onClose,
  onConfirm,
  loading,
  message,
  title = "Confirm Action",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        className="
          w-full max-w-sm

          rounded-xl
          border border-muted
          shadow-2xl
          p-6
          font-mono
          animate-[popup-in_150ms_ease-out]
          custom-backdrop
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        {/* Title */}
        <h2
          id="confirm-title"
          className="text-lg font-semibold text-type-2 mb-2"
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-type-3 mb-6 leading-relaxed">
          {message ||
            "Are you sure you want to proceed? This action cannot be undone."}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              px-4 py-2
              rounded-lg
              border border-gray-300
              text-type-2
              text-sm
              hover:border-gray-500
              hover:bg-gray-50
              hover:text-black
              cursor-pointer
              transition
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2
              rounded-lg
              text-sm font-semibold
              border
              transition
              cursor-pointer
              hover:text-black
              ${
                loading
                  ? "border-red-300 bg-red-200 text-red-600 cursor-not-allowed"
                  : "border-red-500 bg-red-500 text-white hover:bg-red-600"
              }
            `}
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPopUp;

function ConfirmPopUp({ open, onClose, onConfirm, loading, message, title = "Delete Category", backdropStyle }) {
    if (!open) return null;
    const buttonStyle = `px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold transition hover:border-black hover:border-dashed cursor-pointer`;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/ bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-200" style={{ ...backdropStyle }}>
                <h2 className="text-lg font-bold mb-3 text-gray-900">{title}</h2>
                <p className="mb-6 text-gray-700">{message || "Are you sure you want to delete this category? This action cannot be undone."}</p>
                <div className="flex justify-end gap-3">
                    <div
                        className={buttonStyle}
                        onClick={onClose}
                        tabIndex={0}
                        role="button"
                        aria-label="Cancel"
                    >
                        Cancel
                    </div>
                    <div
                        className={buttonStyle + (loading ? " opacity-60 cursor-not-allowed" : "")}
                        onClick={loading ? undefined : onConfirm}
                        disabled={loading}
                        style={{ ...backdropStyle }}
                        tabIndex={0}
                        role="button"
                        aria-label="Delete"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmPopUp;

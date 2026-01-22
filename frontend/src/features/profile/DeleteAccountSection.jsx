import React from "react";

const DeleteAccountSection = ({
  deleteLoading,
  setShowDeleteConfirm,
  deleteError,
  deleteSuccess,
}) => (
  <div className="mt-8 flex flex-col items-center">
    <div
      role="button"
      tabIndex={0}
      aria-label="Delete My Account"
      className={`mt-4 flex items-center justify-center cursor-pointer transition group ${deleteLoading ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => !deleteLoading && setShowDeleteConfirm(true)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !deleteLoading)
          setShowDeleteConfirm(true);
      }}
      style={{ marginTop: "1rem" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={36}
        height={36}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-200 text-gray-500 group-hover:text-red-600"
        style={{ display: "block" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m5 0H4"
        />
      </svg>
      <span className="ml-2 text-sm text-gray-700 group-hover:text-red-600 select-none">
        {deleteLoading ? "Deleting..." : "Delete Account"}
      </span>
    </div>
    {deleteError && <div className="mt-2 text-red-500">{deleteError}</div>}
    {deleteSuccess && <div className="mt-2 text-green-600">{deleteSuccess}</div>}
  </div>
);

export default DeleteAccountSection; 
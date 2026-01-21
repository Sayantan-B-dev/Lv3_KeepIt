const MarkdownUploadBox = ({
  dragActive,
  dragHandlers,
  onFileSelect
}) => {
  return (
    <div
      className={`
        transition
        border
        rounded-lg
        mt-2
        p-4
        flex flex-col items-center justify-center
        cursor-pointer
        bg-type-b2
        hover:bg-white/10
        shadow
        ${dragActive ? "border-muted2 bg-type-3" : "border-muted"}
      `}
      style={{
        outline: dragActive ? "2px solid #6366f1" : "none",
        minHeight: "80px",
        position: "relative"
      }}
      tabIndex={0}
      aria-label="Upload or drag and drop a Markdown file"
      {...dragHandlers}
    >
      <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-type-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mb-1 text-type-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
          />
        </svg>

        <span>
          {dragActive
            ? "Drop your .md file here"
            : "Upload or drag & drop a .md file"}
        </span>

        <input
          type="file"
          accept=".md"
          multiple
          onChange={onFileSelect}
          className="hidden"
          tabIndex={-1}
        />
      </label>

      <div className="text-xs text-gray-500 mt-1 text-center w-full">
        Upload or drag and drop a Markdown (.md) file to add as a note.
        <div className="mt-2 text-xs text-blue-500 font-semibold">
          Note: There will be a 5 second gap between each note.<br />
          Please keep your PC on and{" "}
          <span className="underline text-red-500">do not refresh</span>.
        </div>
      </div>
    </div>
  );
};

export default MarkdownUploadBox;

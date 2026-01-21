const DottedButton2 = ({
  text,
  onClick,
  className = "",
  style,
  tags,
}) => {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`
        flex items-center justify-between gap-2
        break-words
        rounded-lg
        border border-muted2
        px-4 py-2
        font-mono font-medium
        text-type-3
        bg-type-b5
        transition-all duration-150
        hover-muted
        hover-shadow-muted
        hover:cursor-pointer
        ${className}
      `}
    >
      <span>{text}</span>

      {Array.isArray(tags) && tags.length > 0 && (
        <span className="hidden sm:flex flex-wrap gap-1">
          {[...tags].sort().map((tag, idx) => (
            <span
              key={idx}
              className="
                px-2
                text-[10px]
                rounded-md
                border border-muted
                text-type-2
                whitespace-nowrap
              "
            >
              #{tag}
            </span>
          ))}
        </span>
      )}
    </button>
  );
};

export default DottedButton2;

import { useNavigate } from "react-router-dom";

const DottedButton2 = ({
  text,
  onClick,
  className = "",
  style,
  tags,
  innerComponent,
  href,
}) => {
  const navigate = useNavigate();

  const classes = `
    w-fit
    h-full
    flex
    flex-col
    items-start
    justify-between
    text-left
    gap-2
    rounded-lg
    border border-muted2
    px-4 py-2
    font-mono font-medium
    text-type-2
    bg-type-b5
    transition-all duration-150
    hover-muted
    hover-shadow-muted
    cursor-pointer
    min-w-0
    ${className}
  `;

  const handleClick = (e) => {
    if (href) {
      // Allow ctrl+click / cmd+click / middle-click to open in new tab natively
      if (e.metaKey || e.ctrlKey || e.button === 1) return;
      e.preventDefault();
      navigate(href);
    }
    if (onClick) onClick(e);
  };

  const content = (
    <>
      {/* Top row: title + optional inner component */}
      <div className="flex w-full items-start gap-3">
        <span className="flex-1 min-w-0 break-words whitespace-normal leading-snug text-left">
          {text}
        </span>

        {innerComponent && (
          <div className="shrink-0">
            {innerComponent}
          </div>
        )}
      </div>

      {/* Tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-1 w-full">
          {[...tags].sort().map((tag, idx) => (
            <span
              key={idx}
              className="
                px-2
                py-[1px]
                text-[10px]
                rounded-md
                border border-muted
                text-type-3
                break-words
                whitespace-normal
                max-w-full
              "
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </>
  );

  // When href is provided, render as <a> for right-click "Open in new tab"
  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        style={{ ...style, textDecoration: "none", color: "inherit" }}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      style={style}
      className={classes}
    >
      {content}
    </button>
  );
};

export default DottedButton2;

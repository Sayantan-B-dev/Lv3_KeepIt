import { useNavigate } from "react-router-dom";

const DottedButton = ({ text, onClick, style, href, className = "" }) => {
    const navigate = useNavigate();

    const classes = `
        break-all
        rounded-lg
        border border-muted
        px-4
        py-2
        font-semibold
        text-white
        bg-transparent
        transition-all 
        duration-100
        hover-muted
        hover-shadow-muted
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

    // When href is provided, render as <a> for right-click "Open in new tab"
    if (href) {
        return (
            <a
                href={href}
                className={classes}
                style={{ ...style, textDecoration: "none" }}
                onClick={handleClick}
            >
                {text}
            </a>
        );
    }

    return (
        <button
            className={classes}
            style={style}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default DottedButton;

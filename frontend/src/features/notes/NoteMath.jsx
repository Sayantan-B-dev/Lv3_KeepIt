import React from "react";
import "katex/dist/katex.min.css";

const NoteMath = () => {
    return (
        <style>{`
            .math-container .katex-display {
                overflow-x: auto;
                overflow-y: hidden;
                padding: 1rem 0;
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
            }
            .math-container .katex {
                font-size: 1.1em;
                color: inherit;
            }
        `}</style>
    );
};

export default NoteMath;

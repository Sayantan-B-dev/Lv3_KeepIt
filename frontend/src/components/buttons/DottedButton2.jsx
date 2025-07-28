
const DottedButton = ({ text, onClick, className, style }) => {
    const buttonClass = `
        rounded-2xl
        border-2
        border-dashed
        border-black/60
        px-4
        py-2
        font-semibold
        text-black/80
        bg-white/20
        backdrop-blur-xl
        transition-all
        duration-100
        cursor-pointer
        shadow-[0_4px_24px_0_rgba(31,38,135,0.10)]
        hover:bg-white/40
        hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.15)]
        hover:border-indigo-300
        hover:text-indigo-700
        hover:scale-102
        hover:ring-2
        hover:ring-indigo-100
        active:bg-white/60
        active:scale-100
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-200
    `;
    const combinedClass = `${buttonClass} ${className || ""}`;
    return (
        <button
            className={combinedClass}
            style={{
                borderColor: "rgba(0, 0, 0, 0.6)",
                boxShadow: "0 4px 24px 0 rgba(31,38,135,0.10)",
                background: "rgba(255,255,255,0.20)",
                WebkitBackdropFilter: 'blur(16px)',
                backdropFilter: 'blur(16px)',
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                ...style,
                wordBreak: "break-all",
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default DottedButton;
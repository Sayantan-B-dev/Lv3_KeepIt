
const DottedButton = ({ text, onClick, className, style }) => {
    const buttonClass = `
        rounded-2xl 
        border-dashed 
        border-black 
        px-4
        py-2
        font-semibold 
        uppercase 
        text-black
        transition-all 
        duration-300 
        cursor-pointer
        hover:translate-x-[-4px] 
        hover:translate-y-[-4px] 
        hover:rounded-md 
        hover:shadow-[4px_4px_0px_black] 
        active:translate-x-[0px] 
        active:translate-y-[0px] 
        active:rounded-2xl 
        active:shadow-none
    `;
    const combinedClass = `${buttonClass} ${className || ""}`;
    return (
        <button
            className={combinedClass}
            style={{ backgroundColor: "white", borderColor: "black", ...style, wordBreak: "break-all" }}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default DottedButton;
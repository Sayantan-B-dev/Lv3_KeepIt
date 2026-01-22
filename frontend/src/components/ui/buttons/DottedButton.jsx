const DottedButton = ({ text, onClick, style }) => {
    return (
        <button
            className={`
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
            `}
            style={style}
            onClick={onClick}
        >
            {text}
        </button >
    );
};

export default DottedButton;

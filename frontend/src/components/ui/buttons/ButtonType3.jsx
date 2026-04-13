import React from "react";

const ButtonType3 = ({
  text = "Save",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center text-center
        px-4 py-1
        border border-muted
        rounded-lg
        hover:bg-white/20
        hover:translate-y-[-4px]
        active:scale-95
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default ButtonType3;

import React from "react";
import {
  Oval,
  TailSpin,
  ThreeDots,
  Bars,
  Rings,
  Grid,
} from "react-loader-spinner";

/**
 * Loader
 *
 * @param {string} variant - "oval" | "spin" | "dots" | "bars" | "rings" | "grid"
 * @param {number} size - size in px
 * @param {string} text - optional helper text
 * @param {boolean} fullscreen - center in viewport
 */
const Loader = ({
  variant = "oval",
  size = 48,
  text,
  fullscreen = false,
}) => {
  const commonProps = {
    height: size,
    width: size,
    color: "#e5e7eb",
    secondaryColor: "#9ca3af",
    visible: true,
  };

  const renderLoader = () => {
    switch (variant) {
      case "spin":
        return <TailSpin {...commonProps} />;
      case "dots":
        return <ThreeDots height={size / 2} width={size} color="#e5e7eb" />;
      case "bars":
        return <Bars {...commonProps} />;
      case "rings":
        return <Rings {...commonProps} />;
      case "grid":
        return <Grid {...commonProps} />;
      case "oval":
      default:
        return <Oval {...commonProps} />;
    }
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-3
        ${fullscreen ? "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" : "w-full py-6"}
      `}
    >
      {renderLoader()}

      {text && (
        <span className="text-xs text-type-3 tracking-wide animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";

const springConfig = {
  damping: 25,
  stiffness: 120,
};

export default function TiltedCard({
  imageSrc,
  altText = "Profile image",
  captionText = "",
  containerHeight = "280px",
  containerWidth = "220px",
  imageHeight = "280px",
  imageWidth = "220px",
}) {
  const ref = useRef(null);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -8;
    const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 8;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
    scale.set(1.05);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }

  return (
    <div
      ref={ref}
      className="relative cursor-pointer"
      style={{
        height: containerHeight,
        width: containerWidth,
        perspective: "1000px",
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="w-full h-full"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative w-full h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover"
            style={{
              width: imageWidth,
              height: imageHeight,
            }}
          />
          
          {captionText && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white text-sm font-medium truncate">
                {captionText}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

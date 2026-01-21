import { useState, useCallback } from "react";

export default function useDragAndDrop({
  onFilesDrop,
  fileFilter = () => true
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files || []).filter(fileFilter);

    if (files.length > 0 && typeof onFilesDrop === "function") {
      onFilesDrop(files);
    }
  }, [onFilesDrop, fileFilter]);

  return {
    dragActive,
    handlers: {
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop
    }
  };
}

import { useState, useEffect } from "react";

interface UseKonvaCanvasProps {
  containerRef?: React.RefObject<HTMLDivElement>;
  onImageLoad?: (image: HTMLImageElement) => void;
}

interface UseKonvaCanvasReturn {
  imageElement: HTMLImageElement | null;
  imageSize: { width: number; height: number } | null;
  stageSize: { width: number; height: number } | null;
  scale: number;
  setScale: (scale: number) => void;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  handleImageUpload: (file: File) => void;
  resetImage: () => void;
  resetView: () => void;
  setStageSize: (size: { width: number; height: number }) => void;
}

export function useKonvaCanvas({ containerRef, onImageLoad }: UseKonvaCanvasProps = {}): UseKonvaCanvasReturn {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [stageSize, setStageSize] = useState<{ width: number; height: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Set stage size to parent container size
  useEffect(() => {
    function updateStageSize() {
      if (containerRef && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setStageSize({ width: rect.width, height: rect.height });
      } else {
        // fallback to window size minus sidebar/nav
        const maxWidth = window.innerWidth - 60;
        const maxHeight = window.innerHeight - 64;
        setStageSize({ width: maxWidth, height: maxHeight });
      }
    }
    updateStageSize();
    window.addEventListener("resize", updateStageSize);
    return () => window.removeEventListener("resize", updateStageSize);
  }, [containerRef]);

  const resetView = () => {
    if (imageSize && stageSize) {
      // Center image in stage
      const x = (stageSize.width - imageSize.width * scale) / 2;
      const y = (stageSize.height - imageSize.height * scale) / 2;
      setPosition({ x, y });
      setScale(
        stageSize.width / imageSize.width < stageSize.height / imageSize.height
          ? stageSize.width / imageSize.width
          : stageSize.height / imageSize.height,
      );
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const image = new window.Image();
      image.src = e.target?.result as string;
      image.onload = () => {
        setImageElement(image);
        setImageSize({ width: image.width, height: image.height });
        // Center image in stage
        if (stageSize) {
          const x = (stageSize.width - image.width * scale) / 2;
          const y = (stageSize.height - image.height * scale) / 2;
          setPosition({ x, y });
          setScale(
            stageSize.width / image.width < stageSize.height / image.height
              ? stageSize.width / image.width
              : stageSize.height / image.height,
          );
        } else {
          setPosition({ x: 0, y: 0 });
          setScale(1);
        }
        onImageLoad?.(image);
      };
    };
    reader.readAsDataURL(file);
  };

  const resetImage = () => {
    setImageElement(null);
    setImageSize(null);
    setStageSize(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return {
    imageElement,
    imageSize,
    stageSize,
    scale,
    setScale,
    position,
    setPosition,
    handleImageUpload,
    resetImage,
    resetView,
    setStageSize,
  };
}

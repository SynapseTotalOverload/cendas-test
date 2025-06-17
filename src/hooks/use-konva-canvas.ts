import { useState, useEffect } from "react";

interface UseKonvaCanvasProps {
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
}

export function useKonvaCanvas({ onImageLoad }: UseKonvaCanvasProps = {}): UseKonvaCanvasReturn {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [stageSize, setStageSize] = useState<{ width: number; height: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const calculateStageDimensions = (imageWidth: number, imageHeight: number) => {
    // Account for the sidebar width (60px) and navigation height (4rem = 64px)
    const maxWidth = window.innerWidth - 60;
    const maxHeight = window.innerHeight - 64;

    const imageAspectRatio = imageWidth / imageHeight;
    const containerAspectRatio = maxWidth / maxHeight;

    let width = imageWidth;
    let height = imageHeight;

    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider than container
      width = maxWidth;
      height = width / imageAspectRatio;
    } else {
      // Image is taller than container
      height = maxHeight;
      width = height * imageAspectRatio;
    }

    return { width, height };
  };

  const resetView = () => {
    if (imageSize && stageSize) {
      setScale(stageSize.width / imageSize.width);
      setPosition({ x: 0, y: 0 });
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

        const { width, height } = calculateStageDimensions(image.width, image.height);
        setStageSize({ width, height });
        setScale(width / image.width); // Initial scale to fit
        setPosition({ x: 0, y: 0 }); // Reset position
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

  // Update stage size on window resize
  useEffect(() => {
    const handleResize = () => {
      if (imageElement && imageSize) {
        const { width, height } = calculateStageDimensions(imageSize.width, imageSize.height);
        setStageSize({ width, height });
        // Keep the same relative position when resizing
        const scaleChange = width / imageSize.width / scale;
        setScale(width / imageSize.width);
        setPosition({
          x: position.x * scaleChange,
          y: position.y * scaleChange,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageElement, imageSize, scale, position]);

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
  };
}

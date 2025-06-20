import { useState, useEffect } from "react";
import { useImageStore } from "@/stores/image-store";

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
  // Image store integration
  saveCurrentImage: (name?: string) => string | null;
  loadImage: (id: string) => void;
  getCurrentImageId: () => string | null;
  getAllImages: () => Array<{
    id: string;
    name: string;
    width: number;
    height: number;
    createdAt: Date;
  }>;
  deleteImage: (id: string) => void;
  exportCurrentImage: () => File | null;
}

export function useKonvaCanvas({ containerRef, onImageLoad }: UseKonvaCanvasProps = {}): UseKonvaCanvasReturn {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [stageSize, setStageSize] = useState<{ width: number; height: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Image store
  const imageStore = useImageStore.getState();

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
          resetView();
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
    imageStore.setCurrentImage(null);
  };

  // Image store integration methods
  const saveCurrentImage = (name?: string): string | null => {
    if (!imageElement || !imageSize) return null;

    // Convert current image to data URL
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = imageSize.width;
    canvas.height = imageSize.height;
    ctx.drawImage(imageElement, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    const imageName = name || `Image_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}`;

    const id = imageStore.saveImage({
      name: imageName,
      dataUrl,
      width: imageSize.width,
      height: imageSize.height,
    });

    imageStore.setCurrentImage(id);
    return id;
  };

  const loadImage = (id: string) => {
    const savedImage = imageStore.getImage(id);
    if (!savedImage) return;

    const image = new window.Image();
    image.src = savedImage.dataUrl;
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
        resetView();
      }

      imageStore.setCurrentImage(id);
      onImageLoad?.(image);
    };
  };

  const getCurrentImageId = (): string | null => {
    return imageStore.getCurrentImage()?.id || null;
  };

  const getAllImages = () => {
    return imageStore.getAllImages().map(img => ({
      id: img.id,
      name: img.name,
      width: img.width,
      height: img.height,
      createdAt: img.createdAt,
    }));
  };

  const deleteImage = (id: string) => {
    imageStore.deleteImage(id);
    // If we're deleting the current image, reset the canvas
    if (getCurrentImageId() === id) {
      resetImage();
    }
  };

  const exportCurrentImage = (): File | null => {
    const currentImageId = getCurrentImageId();
    if (!currentImageId) return null;
    return imageStore.exportImageAsFile(currentImageId);
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
    // Image store integration
    saveCurrentImage,
    loadImage,
    getCurrentImageId,
    getAllImages,
    deleteImage,
    exportCurrentImage,
  };
}

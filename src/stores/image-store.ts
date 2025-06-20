import { combine, subscribeWithSelector } from "zustand/middleware";
import { toStream } from "@/lib/zustand-utils";
import { create } from "zustand";

type TImageState = {
  savedImages: Record<
    string,
    {
      id: string;
      name: string;
      dataUrl: string;
      width: number;
      height: number;
      createdAt: Date;
    }
  >;
  currentImageId: string | null;
};

type TImageActions = {
  // Image management
  saveImage: (imageData: { name: string; dataUrl: string; width: number; height: number }) => string;

  getImage: (id: string) =>
    | {
        id: string;
        name: string;
        dataUrl: string;
        width: number;
        height: number;
        createdAt: Date;
      }
    | undefined;

  getAllImages: () => Array<{
    id: string;
    name: string;
    dataUrl: string;
    width: number;
    height: number;
    createdAt: Date;
  }>;

  deleteImage: (id: string) => void;

  updateImage: (
    id: string,
    updates: {
      name?: string;
      dataUrl?: string;
      width?: number;
      height?: number;
    },
  ) => void;

  // Current image management
  setCurrentImage: (id: string | null) => void;
  getCurrentImage: () =>
    | {
        id: string;
        name: string;
        dataUrl: string;
        width: number;
        height: number;
        createdAt: Date;
      }
    | undefined;

  // Utility
  clearAllImages: () => void;
  exportImageAsFile: (id: string) => File | null;
  importImageFromFile: (file: File) => Promise<string>;
};

export const useImageStore = create(
  subscribeWithSelector(
    combine<TImageState, TImageActions>({ savedImages: {}, currentImageId: null }, (set, get) => ({
      // Image management
      saveImage: imageData => {
        const id = crypto.randomUUID();
        const newImage = {
          id,
          ...imageData,
          createdAt: new Date(),
        };

        set(state => ({
          savedImages: { ...state.savedImages, [id]: newImage },
        }));

        return id;
      },

      getImage: (id: string) => {
        return get().savedImages[id];
      },

      getAllImages: () => {
        return Object.values(get().savedImages);
      },

      deleteImage: (id: string) => {
        set(state => {
          const newImages = { ...state.savedImages };
          delete newImages[id];
          return {
            savedImages: newImages,
            currentImageId: state.currentImageId === id ? null : state.currentImageId,
          };
        });
      },

      updateImage: (id: string, updates) => {
        set(state => {
          const existingImage = state.savedImages[id];
          if (!existingImage) return state;

          return {
            savedImages: {
              ...state.savedImages,
              [id]: { ...existingImage, ...updates },
            },
          };
        });
      },

      // Current image management
      setCurrentImage: (id: string | null) => {
        set({ currentImageId: id });
      },

      getCurrentImage: () => {
        const { currentImageId, savedImages } = get();
        return currentImageId ? savedImages[currentImageId] : undefined;
      },

      // Utility
      clearAllImages: () => {
        set({ savedImages: {}, currentImageId: null });
      },

      exportImageAsFile: (id: string) => {
        const image = get().savedImages[id];
        if (!image) return null;

        // Convert data URL to blob
        const byteString = atob(image.dataUrl.split(",")[1]);
        const mimeString = image.dataUrl.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });
        return new File([blob], image.name, { type: mimeString });
      },

      importImageFromFile: async (file: File) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => {
            const dataUrl = e.target?.result as string;
            const image = new window.Image();
            image.onload = () => {
              const id = useImageStore.getState().saveImage({
                name: file.name,
                dataUrl,
                width: image.width,
                height: image.height,
              });
              resolve(id);
            };
            image.onerror = () => reject(new Error("Failed to load image"));
            image.src = dataUrl;
          };
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      },
    })),
  ),
);

// Only export observables for non-image data to avoid making images observable
export const imageList$ = toStream(
  useImageStore,
  state =>
    Object.values(state.savedImages).map(img => ({
      id: img.id,
      name: img.name,
      width: img.width,
      height: img.height,
      createdAt: img.createdAt,
    })),
  {
    fireImmediately: true,
  },
);

export const currentImageId$ = toStream(useImageStore, state => state.currentImageId, {
  fireImmediately: true,
});

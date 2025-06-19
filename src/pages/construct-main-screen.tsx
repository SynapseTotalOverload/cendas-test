import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useKonvaCanvas } from "@/hooks/use-konva-canvas";
import { SidebarTools } from "@/components/ui/sidebar-tools";
import { LogOut, TableIcon, Upload } from "lucide-react";
import { useNavigate } from "react-router";
import { ConstructCanvas } from "@/modules/constrcut-canvas";
import { useUserStore } from "@/stores/user-store";
import sampleImageUrl from "@/assets/image.png";

const ConstructMainScreen = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logoutUser, activeUser } = useUserStore.getState();
  const { imageElement, scale, setScale, handleImageUpload, resetView } = useKonvaCanvas({ containerRef });

  const handleZoomIn = () => {
    const SCALE_FACTOR = 1.1;
    const MAX_SCALE = 3;
    const newScale = Math.min(MAX_SCALE, scale * SCALE_FACTOR);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const SCALE_FACTOR = 1.1;
    const MIN_SCALE = 1;
    const newScale = Math.max(MIN_SCALE, scale / SCALE_FACTOR);
    setScale(newScale);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("file", file);
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      <div ref={containerRef} className="flex-1 relative bg-muted/10" style={{ minWidth: 0 }}>
        <ConstructCanvas containerRef={containerRef} />
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />

        {/* Floating Buttons */}
        <div className="fixed bottom-6 right-6 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => {
              logoutUser(activeUser?.username || "");
              navigate("/login");
            }}>
            <LogOut className="w-6 h-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => navigate("/table-view")}>
            <TableIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {imageElement && (
        <SidebarTools
          scale={scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onUpload={() => fileInputRef.current?.click()}
          onReset={resetView}
        />
      )}
    </div>
  );
};

export default ConstructMainScreen;

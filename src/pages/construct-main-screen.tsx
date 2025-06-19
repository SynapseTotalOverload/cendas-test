import { useRef, useState } from "react";
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
  const [editMode, setEditMode] = useState(false);
  const { logoutUser, activeUser } = useUserStore.getState();
  const { scale, setScale, handleImageUpload, resetView, imageSize, stageSize, position, setPosition, imageElement } =
    useKonvaCanvas({ containerRef });

  const handleZoomIn = () => {
    const SCALE_FACTOR = 1.1;
    const MAX_SCALE = 3;
    const newScale = Math.min(MAX_SCALE, scale * SCALE_FACTOR);
    setScale(newScale);
  };

  const handleAddTask = () => {
    setEditMode(true);
  };

  const handleZoomOut = () => {
    const SCALE_FACTOR = 1.1;
    const MIN_SCALE = 0.5;
    const newScale = Math.max(MIN_SCALE, scale / SCALE_FACTOR);
    setScale(newScale);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleImageUpload(file);
    }
  };
  const handleUploadSample = async () => {
    const response = await fetch(sampleImageUrl);
    const blob = await response.blob();
    const file = new File([blob], "image.png", { type: blob.type });
    handleImageUpload(file);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      <div ref={containerRef} className="flex-1 relative bg-muted/10" style={{ minWidth: 0 }}>
        <ConstructCanvas
          position={position}
          setPosition={setPosition}
          imageElement={imageElement}
          setScale={setScale}
          containerRef={containerRef}
          handleImageUpload={handleImageUpload}
          imageSize={imageSize}
          stageSize={stageSize}
          scale={scale}
          editMode={editMode}
          setEditMode={setEditMode}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />

        {/* Floating Buttons */}
        <div className="fixed bottom-6 right-6 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => {
              handleUploadSample();
              
            }}>
            <Upload className="w-6 h-6" />
          </Button>
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

      <SidebarTools
        scale={scale}
        onZoomIn={handleZoomIn}
        onAddTask={handleAddTask}
        onZoomOut={handleZoomOut}
        onUpload={() => fileInputRef.current?.click()}
        onReset={resetView}
        editMode={editMode}
      />
    </div>
  );
};

export default ConstructMainScreen;

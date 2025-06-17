import { useRef, useCallback, useLayoutEffect } from "react";
import { Stage, Layer, Image, Circle } from "react-konva";
import { Button } from "@/components/ui/button";
import { useKonvaCanvas } from "@/hooks/use-konva-canvas";
import { SidebarTools } from "@/components/ui/sidebar-tools";
import { useConstructTasksStore } from "@/stores/construct-tasks-store";
import type { IConstructTask } from "@/types/construct-task";

const MIN_SCALE = 1;
const MAX_SCALE = 3;
const SCALE_FACTOR = 1.1;
const MARKER_RADIUS = 8;

const ConstructMainScreen = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const { tasks } = useConstructTasksStore.getState();
  const formattedTasks = Object?.values(tasks) || [];
  const {
    imageElement,
    imageSize,
    stageSize,
    scale,
    setScale,
    position,
    setPosition,
    handleImageUpload,
    resetView,
    setStageSize,
  } = useKonvaCanvas({ containerRef });
  // Ensure stage size is always up to date with parent div
  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    }
  }, [containerRef, setStageSize]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleWheel = useCallback(
    (e: any) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      const pointerPos = stage.getPointerPosition();
      const oldScale = scale;

      const mousePointTo = {
        x: (pointerPos.x - position.x) / oldScale,
        y: (pointerPos.y - position.y) / oldScale,
      };

      const scaleBy = e.evt.deltaY > 0 ? 1 / SCALE_FACTOR : SCALE_FACTOR;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * scaleBy));

      setScale(newScale);

      // Calculate new position to zoom into mouse pointer
      if (newScale !== oldScale) {
        setPosition({
          x: pointerPos.x - mousePointTo.x * newScale,
          y: pointerPos.y - mousePointTo.y * newScale,
        });
      }
    },
    [scale, position, setScale, setPosition],
  );

  const handleDragStart = useCallback(() => {
    // Optional: Add any drag start logic here
  }, []);

  const handleDragEnd = useCallback(() => {
    // Optional: Add any drag end logic here
  }, []);

  const handleDragMove = useCallback(
    (e: any) => {
      setPosition({
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    [setPosition],
  );

  const handleZoomIn = () => {
    const newScale = Math.min(MAX_SCALE, scale * SCALE_FACTOR);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(MIN_SCALE, scale / SCALE_FACTOR);
    setScale(newScale);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div ref={containerRef} className="flex-1 relative bg-muted/10" style={{ minWidth: 0 }}>
        {!imageElement ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
            <Button onClick={() => fileInputRef.current?.click()} className="px-6 py-3">
              Upload Image
            </Button>
            <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop your image here</p>
          </div>
        ) : (
          <Stage
            width={stageSize?.width || 0}
            height={stageSize?.height || 0}
            onWheel={handleWheel}
            draggable={scale > 1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
            x={position.x}
            y={position.y}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              left: 0,
              top: 0,
              cursor: scale > 1 ? "grab" : "default",
              background: "transparent",
            }}>
            <Layer>
              <Image
                image={imageElement}
                width={imageSize?.width}
                height={imageSize?.height}
                scaleX={scale}
                scaleY={scale}
                x={0}
                y={0}
                listening={false}
              />
              {formattedTasks?.length > 0 &&
                formattedTasks.map(task => (
                  <Circle
                    key={task.id}
                    x={task.coordinates.x}
                    y={task.coordinates.y}
                    radius={MARKER_RADIUS}
                    fill="#FF4D4F"
                    stroke="#FFF"
                    strokeWidth={2}
                  />
                ))}
            </Layer>
          </Stage>
        )}
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

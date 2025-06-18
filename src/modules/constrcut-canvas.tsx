import { useRef, useState } from "react";
import type { Stage as KonvaStage } from "konva/lib/Stage";
import { Stage, Layer, Image } from "react-konva";
import { Button } from "@/components/ui/button";
import { useKonvaCanvas } from "@/hooks/use-konva-canvas";
import { useConstructTasksStore } from "@/stores/construct-tasks-store";
import { icons } from "lucide";
import { getTaskColor, getTaskIconText, renderSvgToKonvaReact } from "@/lib/helpers";
import type { IChecklistItem, IConstructTask, TChecklistStatuses } from "@/types/construct-task";
import { useBoolean } from "@/hooks/use-boolean";
import { TaskPopover } from "@/modules/task-popover";
import Konva from "konva";
import { CheckItemDialog } from "./dialogs/checkitem-dialog";
import type { editChecklistItemSchema } from "@/schemas/edit-schemas";
import type { z } from "zod";

interface ConstructCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ConstructCanvas = ({ containerRef }: ConstructCanvasProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { tasks, updateChecklistItemStatus, deleteChecklistItem, updateChecklistItem } =
    useConstructTasksStore.getState();
  const formattedTasks = Object?.values(tasks) || [];
  const [selectedTask, setSelectedTask] = useState<IConstructTask | null>(null);
  const { isBool, changeBool } = useBoolean();
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);
  const stageRef = useRef<KonvaStage>(null);
  const [editChecklistItem, setEditChecklistItem] = useState<IChecklistItem | null>(null);
  const { imageElement, imageSize, stageSize, scale, setScale, position, setPosition, handleImageUpload } =
    useKonvaCanvas({ containerRef });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    changeBool(selectedTask?.id || "", false);

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    const oldScale = scale;

    const mousePointTo = {
      x: (pointerPos.x - position.x) / oldScale,
      y: (pointerPos.y - position.y) / oldScale,
    };

    const SCALE_FACTOR = 1.1;
    const MIN_SCALE = 1;
    const MAX_SCALE = 3;

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
  };

  const handleDragMove = (e: any) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  if (!imageElement) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
        <Button onClick={() => fileInputRef.current?.click()} className="px-6 py-3">
          Upload Image
        </Button>
        <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop your image here</p>
      </div>
    );
  }

  const handleTaskClick = (task: IConstructTask, e: Konva.KonvaEventObject<MouseEvent>) => {
    setSelectedTask(task);
    changeBool(task.id, true);

    setPopoverPos({
      x: e.evt.clientX,
      y: e.evt.clientY,
    });
  };

  const handleChecklistItemUpdate = (status: TChecklistStatuses, checklistItem: IChecklistItem) => {
    updateChecklistItemStatus(selectedTask?.id || "", checklistItem.id, status);
    setSelectedTask(prev => {
      if (!prev) return null;
      return {
        ...prev,
        checklist: prev.checklist.map(item =>
          item.id === checklistItem.id ? { ...item, status: { id: status, name: status } } : item,
        ),
      };
    });
  };
  const handleChecklistItemDialogSubmit = (data: z.infer<typeof editChecklistItemSchema>) => {
    const updatedChecklistItem = {
      ...editChecklistItem,
      name: data.checklistItemName,
      description: data.checklistItemDescription,
      status: { id: data.checklistItemStatus, name: data.checklistItemStatus },
    };
    updateChecklistItem(selectedTask?.id || "", updatedChecklistItem as IChecklistItem);
    changeBool(editChecklistItem?.id || "", false);
    changeBool(selectedTask?.id || "", false);
  };

  const handleChecklistItemDelete = (checklistItem: IChecklistItem) => {
    deleteChecklistItem(selectedTask?.id || "", checklistItem.id);
    setSelectedTask(prev => {
      if (!prev) return null;
      return {
        ...prev,
        checklist: prev.checklist.filter(item => item.id !== checklistItem.id),
      };
    });
  };
  const handleChecklistItemEdit = (checklistItem: IChecklistItem) => {
    changeBool(checklistItem.id, true);
    setEditChecklistItem(checklistItem);
  };
  return (
    <>
      <Stage
        width={stageSize?.width || 0}
        height={stageSize?.height || 0}
        onWheel={handleWheel}
        draggable={scale > 1}
        ref={stageRef}
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
            formattedTasks.map(task => {
              const iconName = getTaskIconText(task.iconID);
              const icon = icons[iconName as keyof typeof icons];
              const svg = renderSvgToKonvaReact(
                icon,
                task.coordinates.x * scale,
                task.coordinates.y * scale,
                task.id,
                getTaskColor(task.status),
                e => handleTaskClick(task, e),
              );
              return svg;
            })}
        </Layer>
      </Stage>
      <TaskPopover
        open={isBool(selectedTask?.id || "")}
        onOpenChange={(open: boolean) => changeBool(selectedTask?.id || "", open)}
        task={selectedTask as IConstructTask}
        anchorX={popoverPos?.x || 0}
        anchorY={popoverPos?.y || 0}
        onChecklistItemUpdate={handleChecklistItemUpdate}
        onChecklistItemEdit={handleChecklistItemEdit}
        onChecklistItemDelete={handleChecklistItemDelete}
      />
      <CheckItemDialog
        open={isBool(editChecklistItem?.id || "")}
        onOpenChange={(open: boolean) => {
          changeBool(editChecklistItem?.id || "", open);
          setEditChecklistItem(null);
          changeBool(selectedTask?.id || "", false);
        }}
        onSubmit={handleChecklistItemDialogSubmit}
        data={editChecklistItem as IChecklistItem}
      />
    </>
  );
};

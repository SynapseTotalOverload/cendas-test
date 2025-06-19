import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Upload, RotateCcw, Plus } from "lucide-react";

interface SidebarToolsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUpload: () => void;
  onReset: () => void;
  onAddTask: () => void;
  scale: number;
  editMode?: boolean;
}

export function SidebarTools({
  onZoomIn,
  onZoomOut,
  onUpload,
  onReset,
  scale,
  onAddTask,
  editMode = false,
}: SidebarToolsProps) {
  return (
    <div className="w-[60px] h-full bg-background border-l flex flex-col items-center py-4 gap-2 relative z-50">
      <div className="flex flex-col gap-2">
        <Button variant="ghost" size="icon" onClick={onZoomIn} title="Zoom In">
          <ZoomIn className="h-5 w-5" />
        </Button>
        <div className="text-xs text-center text-muted-foreground">{Math.round(scale * 100)}%</div>
        <Button variant="ghost" size="icon" onClick={onZoomOut} title="Zoom Out">
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button
          variant={editMode ? "default" : "ghost"}
          size="icon"
          onClick={onAddTask}
          title="Add Task"
          className={editMode ? "bg-primary text-primary-foreground" : ""}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Button variant="ghost" size="icon" onClick={onUpload} title="Upload New Image">
          <Upload className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onReset} title="Reset View">
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

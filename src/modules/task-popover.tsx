import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { getTaskColor, getTaskIcon } from "@/lib/helpers";
import type { IChecklistItem, IConstructTask, TChecklistStatuses, TConstructStatuses } from "@/types/construct-task";
import { ChevronDownIcon, Ban, Clock, CircleDot, CheckCircle2, XCircle, Circle, CircleSlash } from "lucide-react";

interface TaskPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: IConstructTask;
  anchorX: number;
  anchorY: number;
}

export function TaskPopover({ open, onOpenChange, task, anchorX, anchorY }: TaskPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverContent
        style={{
          position: "absolute",
          top: anchorY,
          left: anchorX,

          pointerEvents: "auto",
        }}
        className="max-w-xl min-w-md p-0 z-50  overflow-hidden">
        {task && (
          <div className="flex flex-col">
            <div className="p-4  bg-white flex flex-row items-center [&>svg]:w-10 [&>svg]:h-10  gap-2">
              {getTaskIcon(task.iconID)}
              <div className="flex flex-col">
                <span className="text-sm font-bold">{task.name}</span>
                <span style={{ color: getTaskColor(task.status) }} className="text-xs">
                  {task.description}
                </span>
              </div>
            </div>
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="p-4 bg-white flex flex-row items-center justify-between w-full">
                <span className="text-sm font-bold">Checklist</span>
                <div className="flex flex-row items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {task.checklist.length} {task.checklist.length === 1 ? "item" : "items"}
                  </span>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-2 first:border-t border-gray-200">
                {task.checklist.map(item => {
                  return <ChecklistItem key={item.id} {...item} />;
                })}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export const ChecklistItem = (checklistItem: IChecklistItem) => {
  const icon = statusStyles[checklistItem.status.id as TChecklistStatuses].icon;
  return (
    <div className="flex flex-row items-center space-x-2 border-t border-gray-200 p-4 gap-2">
      {icon}
      <div className="flex flex-col  w-full">
        <div className="flex flex-col">
          <span
            style={{ color: getTaskColor(checklistItem.status.id as TConstructStatuses) }}
            className="text-xs font-medium">
            {checklistItem.name}
          </span>
          <span className="text-xs text-gray-500">{checklistItem.description}</span>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <span className="text-xs text-gray-500">Status:</span>
          <span style={{ color: getTaskColor(checklistItem.status.id as TConstructStatuses) }} className="text-xs ">
            {checklistItem.status.name}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper to map checklist statuses to colors and icons (you need to fill in icon components or classes)
const statusStyles: Record<TChecklistStatuses, { color: string; icon: React.ReactNode }> = {
  blocked: {
    color: "text-red-600",
    icon: <Ban className="w-4 h-4" />,
  },
  pending: {
    color: "text-gray-600",
    icon: <Clock className="w-4 h-4" />,
  },
  "in-progress": {
    color: "text-blue-600",
    icon: <CircleDot className="w-4 h-4" />,
  },
  completed: {
    color: "text-green-600",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  "not-applicable": {
    color: "text-gray-400",
    icon: <XCircle className="w-4 h-4" />,
  },
  "not-started": {
    color: "text-gray-400",
    icon: <Circle className="w-4 h-4" />,
  },
  "not-required": {
    color: "text-gray-300",
    icon: <CircleSlash className="w-4 h-4" />,
  },
};

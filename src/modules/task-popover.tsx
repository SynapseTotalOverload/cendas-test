import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent } from "@/components/ui/popover";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSubTrigger,
  ContextMenuSub,
  ContextMenuTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";
import { getTaskColor, getTaskIcon } from "@/lib/helpers";
import type { IChecklistItem, IConstructTask, TChecklistStatuses, TConstructStatuses } from "@/types/construct-task";
import { ChevronDownIcon, Edit, ArrowDownUp, Trash } from "lucide-react";
import { ChecklistItem } from "@/components/ui/checklist-item";

interface TaskPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: IConstructTask;
  anchorX: number;
  anchorY: number;
  onChecklistItemUpdate: (status: TChecklistStatuses, checklistItem: IChecklistItem) => void;
  onChecklistItemDelete: (checklistItem: IChecklistItem) => void;
  onChecklistItemEdit: (checklistItem: IChecklistItem) => void;
  onTaskEdit?: () => void;
  onTaskDelete?: () => void;
  onTaskStatusChange?: (status: TConstructStatuses) => void;
}

export function TaskPopover({
  open,
  onOpenChange,
  task,
  anchorX,
  anchorY,
  onChecklistItemDelete,
  onChecklistItemUpdate,
  onChecklistItemEdit,
  onTaskEdit,
  onTaskDelete,
  onTaskStatusChange,
}: TaskPopoverProps) {
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
          <ContextMenu>
            <ContextMenuTrigger>
              <>
                <span className="text-[12px] text-gray-300 text-center">
                  We have here context menu (right click on the task/checklist item)
                </span>
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
                        return (
                          <ChecklistItem
                            key={item.id}
                            {...item}
                            onStatusChange={status => {
                              onChecklistItemUpdate(status, item);
                            }}
                            onDelete={() => {
                              onChecklistItemDelete(item);
                            }}
                            onEdit={() => {
                              onChecklistItemEdit(item);
                            }}
                          />
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={onTaskEdit}>
                <Edit className="h-4 w-4" /> Edit Task
              </ContextMenuItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger className="flex flex-row items-center gap-2">
                  <ArrowDownUp className="h-4 w-4" /> Status
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem
                    style={{ color: getTaskColor("pending") }}
                    onClick={() => onTaskStatusChange?.("pending")}>
                    Pending
                  </ContextMenuItem>
                  <ContextMenuItem
                    style={{ color: getTaskColor("in-progress") }}
                    onClick={() => onTaskStatusChange?.("in-progress")}>
                    In Progress
                  </ContextMenuItem>
                  <ContextMenuItem
                    style={{ color: getTaskColor("awaiting") }}
                    onClick={() => onTaskStatusChange?.("awaiting")}>
                    Awaiting
                  </ContextMenuItem>
                  <ContextMenuItem
                    style={{ color: getTaskColor("completed") }}
                    onClick={() => onTaskStatusChange?.("completed")}>
                    Completed
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuItem onClick={onTaskDelete}>
                <Trash className="h-4 w-4" /> Delete Task
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
      </PopoverContent>
    </Popover>
  );
}

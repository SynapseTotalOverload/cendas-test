import { Edit, ArrowDownUp, Trash } from "lucide-react";
import type { IChecklistItem, TChecklistStatuses } from "@/types/construct-task";
import { getChecklistStatusColor, statusStyles } from "@/lib/helpers";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSubTrigger,
  ContextMenuSub,
  ContextMenuTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";

export interface ChecklistItemProps extends IChecklistItem {
  onStatusChange: (status: TChecklistStatuses) => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const ChecklistItem = ({ status, name, description, onStatusChange, onDelete, onEdit }: ChecklistItemProps) => {
  const icon = statusStyles[status.id as TChecklistStatuses]?.icon;
  console.log(status.id, statusStyles[status.id as TChecklistStatuses]);
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex flex-row items-center space-x-2 border-t border-gray-200 p-4 gap-2">
          {icon}
          <div className="flex flex-col w-full">
            <div className="flex flex-col">
              <span
                style={{ color: getChecklistStatusColor(status.id as TChecklistStatuses) }}
                className="text-xs font-medium">
                {name}
              </span>
              <span className="text-xs text-gray-500">{description}</span>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <span className="text-xs text-gray-500">Status:</span>
              <span style={{ color: getChecklistStatusColor(status.id as TChecklistStatuses) }} className="text-xs">
                {status.name}
              </span>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onEdit}>
          <Edit className="h-4 w-4" /> Edit
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex flex-row items-center gap-2">
            <ArrowDownUp className="h-4 w-4" /> Status
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("not-started") }}
              onClick={() => onStatusChange("not-started")}>
              Not Started
            </ContextMenuItem>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("in-progress") }}
              onClick={() => onStatusChange("in-progress")}>
              In Progress
            </ContextMenuItem>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("final-check") }}
              onClick={() => onStatusChange("final-check")}>
              Final Check
            </ContextMenuItem>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("awaiting") }}
              onClick={() => onStatusChange("awaiting")}>
              Awaiting
            </ContextMenuItem>
            <ContextMenuItem style={{ color: getChecklistStatusColor("done") }} onClick={() => onStatusChange("done")}>
              Done
            </ContextMenuItem>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("blocked") }}
              onClick={() => onStatusChange("blocked")}>
              Blocked
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem onClick={onDelete}>
          <Trash className="h-4 w-4" /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

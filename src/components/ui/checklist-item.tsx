import {
  Ban,
  Clock,
  CircleDot,
  CheckCircle2,
  XCircle,
  Circle,
  CircleSlash,
  Edit,
  ArrowDownUp,
  Trash,
} from "lucide-react";
import type { IChecklistItem, TChecklistStatuses, TConstructStatuses } from "@/types/construct-task";
import { getChecklistStatusColor, getTaskColor } from "@/lib/helpers";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSubTrigger,
  ContextMenuSub,
  ContextMenuTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu";

// Helper to map checklist statuses to colors and icons
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

export interface ChecklistItemProps extends IChecklistItem {
  onStatusChange: (status: TChecklistStatuses) => void;
  onDelete: () => void;
  onEdit: () => void;
}

export const ChecklistItem = ({ status, name, description, onStatusChange, onDelete, onEdit }: ChecklistItemProps) => {
  const icon = statusStyles[status.id as TChecklistStatuses].icon;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex flex-row items-center space-x-2 border-t border-gray-200 p-4 gap-2">
          {icon}
          <div className="flex flex-col w-full">
            <div className="flex flex-col">
              <span style={{ color: getTaskColor(status.id as TConstructStatuses) }} className="text-xs font-medium">
                {name}
              </span>
              <span className="text-xs text-gray-500">{description}</span>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <span className="text-xs text-gray-500">Status:</span>
              <span style={{ color: getTaskColor(status.id as TConstructStatuses) }} className="text-xs">
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
              style={{ color: getChecklistStatusColor("pending") }}
              onClick={() => onStatusChange("pending")}>
              Pending
            </ContextMenuItem>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("in-progress") }}
              onClick={() => onStatusChange("in-progress")}>
              In Progress
            </ContextMenuItem>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("completed") }}
              onClick={() => onStatusChange("completed")}>
              Completed
            </ContextMenuItem>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("not-applicable") }}
              onClick={() => onStatusChange("not-applicable")}>
              Not Applicable
            </ContextMenuItem>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("not-started") }}
              onClick={() => onStatusChange("not-started")}>
              Not Started
            </ContextMenuItem>
            <ContextMenuItem
              style={{ color: getChecklistStatusColor("not-required") }}
              onClick={() => onStatusChange("not-required")}>
              Not Required
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

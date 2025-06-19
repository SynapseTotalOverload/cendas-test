import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IConstructTask, TChecklistStatuses } from "@/types/construct-task";

import { getTaskIcon, getTaskStatus, statusStyles } from "@/lib/helpers";

interface KanbanTaskCardProps {
  task: IConstructTask;
  isDragging?: boolean;
}

export function KanbanTaskCard({ task, isDragging: externalDragging = false }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isDragging = externalDragging || sortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg border overflow-hidden border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50 shadow-none" : ""
      }`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-shrink-0">{getTaskIcon(task.iconID)}</div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-gray-900 truncate">{task.name}</h4>
          <p className="text-xs text-gray-500 truncate">{task.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">{getTaskStatus(task.status)}</div>
        <div className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</div>
      </div>

      {task.checklist.length > 0 && (
        <div className="border-t border-gray-100 pt-2">
          <div className="text-xs text-gray-500 mb-1">Checklist ({task.checklist.length} items)</div>
          <div className="space-y-1">
            {task.checklist.slice(0, 2).map(item => (
              <div key={item.id} className="flex items-center gap-2 text-xs">
                <div className="flex-shrink-0">{statusStyles[item.status.id as TChecklistStatuses]?.icon}</div>
                <div className="min-w-0 flex-1 truncate">{item.name}</div>
              </div>
            ))}
            {task.checklist.length > 2 && (
              <div className="text-xs text-gray-400">+{task.checklist.length - 2} more items</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { IConstructTask, TConstructStatuses } from "@/types/construct-task";

import { KanbanTaskCard } from "@/modules/kanban/kanban-task-card";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: TConstructStatuses;
  title: string;
  tasks: IConstructTask[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  let bgColor;
  switch (id) {
    case "awaiting":
      bgColor = "bg-blue-100";
      break;
    case "pending":
      bgColor = "bg-red-100";
      break;
    case "in-progress":
      bgColor = "bg-yellow-100";
      break;
    case "completed":
      bgColor = "bg-green-100";
      break;
    default:
      bgColor = "bg-gray-100";
      break;
  }

  return (
    <div className="flex flex-col min-w-[280px]">
      <div className={cn("rounded-t-lg p-3 border-b border-gray-600 backdrop-contrast-10", bgColor)}>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <span className="text-sm text-gray-600">{tasks.length} tasks</span>
      </div>

      {/* Droppable area */}
      <div ref={setNodeRef} className="bg-gray-50 rounded-b-lg p-3 min-h-[400px]">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map(task => (
              <KanbanTaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <p className="text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

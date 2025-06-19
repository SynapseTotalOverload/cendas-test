import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import type { IConstructTask, TConstructStatuses } from "@/types/construct-task";

import { KanbanColumn } from "@/modules/kanban/kanban-column";
import { KanbanTaskCard } from "@/modules/kanban/kanban-task-card";
import { getTaskColor } from "@/lib/helpers";

interface ConstructKanbanBoardProps {
  tasks: IConstructTask[];
  handleUpdateTaskStatus: (id: string, status: TConstructStatuses) => void;
}

const STATUS_COLUMNS: Array<{
  id: TConstructStatuses;
  title: string;
  color: string;
}> = [
  { id: "awaiting", title: "Awaiting", color: getTaskColor("awaiting") },
  { id: "pending", title: "Pending", color: getTaskColor("pending") },
  { id: "in-progress", title: "In Progress", color: getTaskColor("in-progress") },
  { id: "completed", title: "Completed", color: getTaskColor("completed") },
];

export function ConstructKanbanBoard({ tasks, handleUpdateTaskStatus }: ConstructKanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<IConstructTask | null>(null);
  const [taskItems, setTaskItems] = useState<IConstructTask[]>(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = taskItems.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = taskItems.find(t => t.id === activeId);
    const overTask = taskItems.find(t => t.id === overId);
    const isOverColumn = !overTask;

    if (!activeTask) return;

    const newStatus: TConstructStatuses = isOverColumn ? (overId as TConstructStatuses) : overTask!.status;

    const updated = taskItems.filter(t => t.id !== activeId);

    // insert at correct position
    if (isOverColumn) {
      // dropped on empty column → push to end
      let insertIndex = updated.length;
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].status === newStatus) {
          insertIndex = i + 1;
          break;
        }
      }
      updated.splice(insertIndex, 0, { ...activeTask, status: newStatus });
    } else {
      // dropped over another task → insert at that index
      const toIndex = updated.findIndex(t => t.id === overId);
      updated.splice(toIndex, 0, { ...activeTask, status: newStatus });
    }
    handleUpdateTaskStatus(activeId, newStatus);
    setTaskItems(updated);
  };

  const getTasksByStatus = (status: TConstructStatuses) => taskItems.filter(task => task.status === status);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map(column => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <SortableContext key={column.id} items={columnTasks.map(t => t.id)} strategy={rectSortingStrategy}>
              <KanbanColumn id={column.id} title={column.title} color={column.color} tasks={columnTasks} />
            </SortableContext>
          );
        })}
      </div>

      <DragOverlay>{activeTask && <KanbanTaskCard task={activeTask} isDragging />}</DragOverlay>
    </DndContext>
  );
}

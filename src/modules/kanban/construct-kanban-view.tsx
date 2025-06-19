import type { IConstructTask, TChecklistStatuses } from "@/types/construct-task";

import { getTaskIcon, getTaskStatus, statusStyles } from "@/lib/helpers";

interface ConstructKanbanViewProps {
  tasks: IConstructTask[];
}

export function ConstructKanbanView({ tasks }: ConstructKanbanViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => (
        <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0">{getTaskIcon(task.iconID)}</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">{task.name}</h3>
              <p className="text-xs text-gray-500 truncate">{task.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">{getTaskStatus(task.status)}</div>
            <div className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500 mb-2">Checklist ({task.checklist.length} items)</div>
            <div className="space-y-1">
              {task.checklist.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center gap-2 text-xs">
                  <div className="flex-shrink-0">{statusStyles[item.status.id as TChecklistStatuses]?.icon}</div>
                  <div className="min-w-0 flex-1 truncate">{item.name}</div>
                </div>
              ))}
              {task.checklist.length > 3 && (
                <div className="text-xs text-gray-400">+{task.checklist.length - 3} more items</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

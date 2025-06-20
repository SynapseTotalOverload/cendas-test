import { useState } from "react";
import { Table, Kanban, LogOut, Map } from "lucide-react";

import { ConstructTableView } from "@/modules/table-view/construct-table-view";
import { ConstructKanbanBoard } from "@/modules/kanban/construct-kanban-board";
import { useConstructTasksStore } from "@/stores/construct-tasks-store";
import type { TConstructStatuses } from "@/types/construct-task";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useUserStore } from "@/stores/user-store";

export default function ConstructTablePage() {
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");
  const navigate = useNavigate();
  const { tasks, updateTaskStatus } = useConstructTasksStore.getState();
  const { logoutUser, activeUser } = useUserStore.getState();
  const formattedTasks = Object.values(tasks);
  const handleUpdateTaskStatus = (id: string, status: TConstructStatuses) => {
    updateTaskStatus(id, status);
  };
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">{viewMode === "table" ? "Table View" : "Kanban View"}</h1>
          <p className="text-sm text-gray-500">This is a list of all the construct tasks in the database.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}>
            <Table className="w-4 h-4" />
            Table
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "kanban" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}>
            <Kanban className="w-4 h-4" />
            Kanban
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <ConstructTableView tasks={formattedTasks} />
      ) : (
        <ConstructKanbanBoard handleUpdateTaskStatus={handleUpdateTaskStatus} tasks={formattedTasks} />
      )}
      <div className="fixed bottom-6 right-6 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => {
            logoutUser(activeUser?.username || "");
            navigate("/login");
          }}>
          <LogOut className="w-6 h-6" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => navigate("/")}>
          <Map className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

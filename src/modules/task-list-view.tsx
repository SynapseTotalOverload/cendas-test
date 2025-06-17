"use client";

import { useState } from "react";
import { useTaskStore } from "@lib/store";
import { TaskDialog } from "./task-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, CheckCircle, Clock, Circle } from "lucide-react";

export function TaskListView() {
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await updateTask(taskId, { status: newStatus as any });
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setShowDialog(true);
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
    }
  };

  const handleSubmit = async (taskData: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    }
    setShowDialog(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Task List</h1>
        <div className="text-sm text-muted-foreground">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Circle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Go to the Floor Plan view to add your first construction task
              </p>
            </CardContent>
          </Card>
        ) : (
          tasks.map(task => (
            <Card key={task.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(task)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>{task.priority} priority</Badge>
                    <Badge variant="outline">{task.status.replace("-", " ")}</Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(task.id, "pending")}
                      disabled={task.status === "pending"}>
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(task.id, "in-progress")}
                      disabled={task.status === "in-progress"}>
                      In Progress
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(task.id, "completed")}
                      disabled={task.status === "completed"}>
                      Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <TaskDialog
        open={showDialog}
        onOpenChange={open => {
          setShowDialog(open);
          if (!open) setEditingTask(null);
        }}
        onSubmit={handleSubmit}
        title={editingTask ? "Edit Task" : "Create New Task"}
        initialData={editingTask}
      />
    </div>
  );
}

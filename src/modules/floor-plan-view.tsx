"use client";

import type React from "react";

import { useRef, useState } from "react";
import { useTaskStore } from "@/lib/store";
import { TaskMarker } from "@/modules/task-marker";
import { TaskDialog } from "@/modules/task-dialog";
import { Card } from "@/components/ui/card";

export function FloorPlanView() {
  const { tasks, addTask, selectedTask, selectTask } = useTaskStore();
  const [showDialog, setShowDialog] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const floorPlanRef = useRef<HTMLDivElement>(null);

  const handleFloorPlanClick = (e: React.MouseEvent) => {
    if (!floorPlanRef.current) return;

    const rect = floorPlanRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPosition({ x, y });
    setShowDialog(true);
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }) => {
    await addTask({
      ...taskData,
      status: "pending",
      x: clickPosition.x,
      y: clickPosition.y,
    });
    setShowDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Floor Plan</h1>
        <div className="text-sm text-muted-foreground">Click anywhere on the floor plan to add a task</div>
      </div>

      <Card className="p-4">
        <div
          ref={floorPlanRef}
          className="relative w-full h-[600px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg cursor-crosshair overflow-hidden"
          onClick={handleFloorPlanClick}
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}>
          {/* Floor plan grid background */}
          <div className="absolute inset-4 border border-slate-300 rounded">
            <div className="absolute top-4 left-4 text-xs text-slate-500">Room 1</div>
            <div className="absolute top-4 right-4 text-xs text-slate-500">Room 2</div>
            <div className="absolute bottom-4 left-4 text-xs text-slate-500">Room 3</div>
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">Room 4</div>
          </div>

          {/* Task markers */}
          {tasks.map(task => (
            <TaskMarker
              key={task.id}
              task={task}
              onClick={() => selectTask(task)}
              isSelected={selectedTask?.id === task.id}
            />
          ))}
        </div>
      </Card>

      <TaskDialog open={showDialog} onOpenChange={setShowDialog} onSubmit={handleCreateTask} title="Create New Task" />
    </div>
  );
}

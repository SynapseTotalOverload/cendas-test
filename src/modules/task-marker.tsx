"use client";

import type { ConstructionTask } from "@lib/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Circle } from "lucide-react";

interface TaskMarkerProps {
  task: ConstructionTask;
  onClick: () => void;
  isSelected: boolean;
}

export function TaskMarker({ task, onClick, isSelected }: TaskMarkerProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "in-progress":
        return <Clock className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "completed":
        return "border-green-500";
      case "in-progress":
        return "border-yellow-500";
      default:
        return "border-slate-400";
    }
  };

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${task.x}%`, top: `${task.y}%` }}>
      <Button
        size="sm"
        className={`
          h-8 w-8 rounded-full p-0 text-white shadow-lg transition-all
          ${getPriorityColor()}
          ${isSelected ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : ""}
        `}
        onClick={e => {
          e.stopPropagation();
          onClick();
        }}>
        {getStatusIcon()}
      </Button>

      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          <div className="font-medium">{task.title}</div>
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
              {task.status}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {task.priority}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

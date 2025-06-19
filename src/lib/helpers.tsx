import type { TChecklistStatuses, TConstructIconID, TConstructStatuses } from "@/types/construct-task";
import {
  Lightbulb,
  Zap,
  Droplet,
  Paintbrush,
  Hammer,
  Building,
  Layers,
  AppWindowMac,
  Sun,
  Clock,
  Ban,
  CircleDot,
  CheckCircle2,
  XCircle,
  PenLine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Group, Circle, Path, Rect, Ellipse } from "react-konva";
import type Konva from "konva";

export function getTaskIcon(iconID: TConstructIconID) {
  switch (iconID) {
    case "lampwork":
      return <Lightbulb className="w-4 h-4" />;
    case "lighting":
      return <Sun className="w-4 h-4" />;
    case "electrical":
      return <Zap className="w-4 h-4" />;
    case "plumbing":
      return <Droplet className="w-4 h-4" />;
    case "painting":
      return <Paintbrush className="w-4 h-4" />;
    case "carpentry":
      return <Hammer className="w-4 h-4" />;
    case "masonry":
      return <Building className="w-4 h-4" />;
    case "flooring":
      return <Layers className="w-4 h-4" />;
    case "roofing":
      return <Building className="w-4 h-4" />;
    case "walling":
      return <Building className="w-4 h-4" />;
    case "ceiling":
      return <Layers className="w-4 h-4" />;
    case "doors":
      return <AppWindowMac className="w-4 h-4" />;
    case "windows":
      return <AppWindowMac className="w-4 h-4" />;
    case "other":
      return <PenLine className="w-4 h-4" />;
    default:
      return <PenLine className="w-4 h-4" />;
  }
}
export function getTaskIconText(iconID: TConstructIconID) {
  switch (iconID) {
    case "lampwork":
      return "Lightbulb";
    case "lighting":
      return "Sun";
    case "electrical":
      return "Zap";
    case "plumbing":
      return "Droplet";
    case "painting":
      return "Paintbrush";
    case "carpentry":
      return "Hammer";
    case "masonry":
      return "Building";
    case "flooring":
      return "Layers";
    case "roofing":
      return "Building";
    case "walling":
      return "Building";
    case "ceiling":
      return "Layers";
    case "doors":
      return "AppWindowMac";
    case "windows":
      return "AppWindowMac";
    case "other":
      return "PenLine";
    default:
      return "PenLine";
  }
}

export function getTaskStatus(status: TConstructStatuses) {
  switch (status) {
    case "awaiting":
      return <Badge className="bg-[#2618e9f4] text-white hover:bg-[#2618e9f4]">Awaiting</Badge>;
    case "pending":
      return <Badge className="bg-[#f7402f] text-white hover:bg-[#f7402f]">Pending</Badge>;
    case "in-progress":
      return <Badge className="bg-[#d7cb1e] text-white hover:bg-[#d7cb1e]">In Progress</Badge>;
    case "completed":
      return <Badge className="bg-[#05c91f] text-white hover:bg-[#05c91f]">Completed</Badge>;
    default:
      return <Badge className="bg-[#6a6a6a] text-white hover:bg-[#6a6a6a]">Unknown</Badge>;
  }
}
export function getTaskColor(status: TConstructStatuses) {
  switch (status) {
    case "awaiting":
      return "#2618e9f4";
    case "pending":
      return "#f7402f";
    case "in-progress":
      return "#d7cb1e";
    case "completed":
      return "#05c91f";
    default:
      return "#6a6a6a";
  }
}
export function getChecklistStatusColor(status: TChecklistStatuses) {
  switch (status) {
    case "blocked":
      return "#dc2626";
    case "in-progress":
      return "#d7cb1e";
    case "final-check":
      return "#05c91f";
    case "awaiting":
      return "#9371a6";
    case "done":
      return "#00a405";
    case "not-started":
      return "#a84444";
    default:
      return "#6a6a6a";
  }
}
export function renderSvgToKonvaReact(
  icon: any[],
  x: number,
  y: number,
  key?: string,
  color?: string,
  onAction?: (e: Konva.KonvaEventObject<MouseEvent>) => void,
) {
  return (
    <Group
      className="cursor-pointer"
      onClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
        onAction?.(e);
      }}
      key={key}
      x={x}
      y={y}>
      {/* Background circle at center */}
      <Circle radius={12} fill={color} stroke="#000000" strokeWidth={1} />

      {/* Center icon content */}
      <Group offsetX={12} offsetY={12} x={12} y={12}>
        {icon.map(([tag, attrs], idx) => {
          if (tag === "path") {
            return (
              <Path key={idx} data={attrs.d} stroke="#FFFFFF" scaleX={0.8} scaleY={0.8} offsetX={12} offsetY={12} />
            );
          }

          if (tag === "circle") {
            return <Circle key={idx} radius={attrs.r} x={0} y={0} fill={color} stroke="#FFFFFF" strokeWidth={1} />;
          }

          if (tag === "ellipse") {
            return (
              <Ellipse
                key={idx}
                radiusX={attrs.rx}
                radiusY={attrs.ry}
                x={attrs.cx - 12}
                y={attrs.cy - 12}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth={1}
              />
            );
          }

          if (tag === "rect") {
            return (
              <Rect
                key={idx}
                x={parseFloat(attrs.x) - 12}
                y={parseFloat(attrs.y) - 12}
                width={parseFloat(attrs.width)}
                height={parseFloat(attrs.height)}
                cornerRadius={attrs.rx ? parseFloat(attrs.rx) : 0}
                scaleX={0.8}
                scaleY={0.8}
                stroke="#FFFFFF"
              />
            );
          }

          return null;
        })}
      </Group>
    </Group>
  );
}

export const statusStyles: Record<TChecklistStatuses, { color: string; icon: React.ReactNode }> = {
  blocked: {
    color: "text-red-600",
    icon: <Ban className="w-4 h-4" />,
  },
  "in-progress": {
    color: "text-gray-600",
    icon: <Clock className="w-4 h-4" />,
  },
  "final-check": {
    color: "text-blue-600",
    icon: <CircleDot className="w-4 h-4" />,
  },
  awaiting: {
    color: "text-green-600",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  done: {
    color: "text-gray-400",
    icon: <XCircle className="w-4 h-4" />,
  },
  "not-started": {
    color: "text-gray-400",
    icon: <Circle className="w-4 h-4" />,
  },
};

import type { TConstructIconID, TConstructStatuses } from "@/types/construct-task";
import { Lightbulb, Zap, Droplet, Paintbrush, Hammer, Building, Layers, AppWindowMac, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Group, Circle, Path, Rect, Ellipse } from "react-konva";

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

    default:
      return <AppWindowMac className="w-4 h-4" />;
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
    default:
      return "AppWindowMac";
  }
}

export function getTaskStatus(status: TConstructStatuses) {
  switch (status) {
    case "awaiting":
      return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Awaiting</Badge>;
    case "pending":
      return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Pending</Badge>;
    case "in-progress":
      return <Badge className="bg-green-500 text-white hover:bg-green-600">In Progress</Badge>;
    case "completed":
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Completed</Badge>;
    default:
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
  }
}
export function getTaskColor(status: TConstructStatuses) {
  console.log(status, 66);
  switch (status) {
    case "awaiting":
      return "#2618e9";
    case "pending":
      return "#f7402f";
    case "in-progress":
      return "#ded222";
    case "completed":
      return "#00ff22";
    default:
      return "#6a6a6a";
  }
}
// Convert SVG path data to Konva shape
export function renderSvgToKonvaReact(
  icon: any[],
  x: number,
  y: number,
  scale: number = 1,
  key?: string,
  color?: string,
) {
  console.log(icon, 33);
  return (
    <Group key={key} x={x} y={y} scaleX={scale} scaleY={scale}>
      <Circle radius={16} fill={color} stroke="#000000" strokeWidth={1} />
      {icon.map(([tag, attrs], idx) => {
        if (tag === "path") {
          return <Path key={idx} data={attrs.d} stroke="#000000" scaleX={0.8} scaleY={0.8} x={-12} y={-12} />;
        }
        if (tag === "circle") {
          return <Circle key={idx} radius={attrs.r} fill={color} stroke="#000000" strokeWidth={1} />;
        }
        if (tag === "ellipse") {
          return (
            <Ellipse
              key={idx}
              radiusX={attrs.rx}
              cx={attrs.cx}
              radiusY={attrs.ry}
              cy={attrs.cy}
              rx={attrs.rx}
              ry={attrs.ry}
              fill={color}
              stroke="#000000"
              strokeWidth={1}
            />
          );
        }

        if (tag === "rect") {
          return (
            <Rect
              stroke="#000000"
              key={idx}
              x={parseFloat(attrs.x) - 12}
              y={parseFloat(attrs.y) - 12}
              width={parseFloat(attrs.width)}
              height={parseFloat(attrs.height)}
              cornerRadius={attrs.rx ? parseFloat(attrs.rx) : 0}
              scaleX={0.8}
              scaleY={0.8}
            />
          );
        }

        return null;
      })}
    </Group>
  );
}

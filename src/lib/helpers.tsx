import type { TConstructIconID, TConstructStatuses } from "@/types/construct-task";
import { Lightbulb, Zap, Droplet, Paintbrush, Hammer, Building, Layers, Cone, AppWindowMac } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function getTaskIcon(iconID: TConstructIconID) {
  switch (iconID) {
    case "lampwork":
      return <Lightbulb className="w-4 h-4" />;
    case "lighting":
      return <Cone className="w-4 h-4" />;
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

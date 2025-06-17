import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Map, List, Hammer, Image } from "lucide-react";

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hammer className="h-6 w-6" />
            <span className="font-bold text-lg">Construction Tasks</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant={location.pathname === "/" ? "default" : "ghost"} size="sm" asChild>
              <Link to="/" className="flex items-center space-x-2">
                <Map className="h-4 w-4" />
                <span>Floor Plan</span>
              </Link>
            </Button>

            <Button variant={location.pathname === "/tasks" ? "default" : "ghost"} size="sm" asChild>
              <Link to="/tasks" className="flex items-center space-x-2">
                <List className="h-4 w-4" />
                <span>Task List</span>
              </Link>
            </Button>

            <Button variant={location.pathname === "/image-editor" ? "default" : "ghost"} size="sm" asChild>
              <Link to="/image-editor" className="flex items-center space-x-2">
                <Image className="h-4 w-4" />
                <span>Image Editor</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

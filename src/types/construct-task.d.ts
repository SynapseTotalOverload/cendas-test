export type TConstructStatuses = "awaiting" | "pending" | "in-progress" | "completed";
export type TChecklistStatuses = "not-started" | "in-progress" | "blocked" | "final-check" | "awaiting" | "done";

export type TConstructIconID =
  | "lampwork"
  | "lighting"
  | "electrical"
  | "plumbing"
  | "painting"
  | "carpentry"
  | "masonry"
  | "flooring"
  | "roofing"
  | "walling"
  | "ceiling"
  | "doors"
  | "windows"
  | "other";

export interface IConstructTask {
  id: string;
  name: string;
  description: string;
  status: TConstructStatuses;
  iconID: TConstructIconID;
  coordinates: {
    x: number;
    y: number;
  };
  createdAt: string;
  updatedAt: string;
  checklist: IChecklistItem[];
}

export interface IChecklistItem {
  id: string;
  iconID: string;
  name: string;
  description: string;
  status: {
    id: TChecklistStatuses;
    name: string;
  };
}

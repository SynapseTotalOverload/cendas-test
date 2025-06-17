export type TConstructStatuses = "awaiting" | "pending" | "in-progress" | "completed";
export type TChecklistStatuses =
  | "blocked"
  | "pending"
  | "in-progress"
  | "completed"
  | "not-applicable"
  | "not-started"
  | "not-required";
export interface IConstructTask {
  id: string;
  name: string;
  description: string;
  status: TConstructStatuses;
  iconID: string;
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

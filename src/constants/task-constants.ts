import type { IConstructTask } from "@/types/construct-task";
import { v4 as uuidv4 } from "uuid";

// Фиксированный ID пользователя для демо-данных
const DEMO_USER_ID = "demo-user-123";

export const taskConstants: IConstructTask[] = [
  {
    id: uuidv4(),
    userId: DEMO_USER_ID,
    name: "Foundation Work",
    description: "Excavate and pour concrete for the building foundation.",
    status: "pending",
    iconID: "lampwork",
    coordinates: { x: 100, y: 200 },
    createdAt: "2024-06-01T08:00:00Z",
    updatedAt: "2024-06-01T08:00:00Z",
    checklist: [
      {
        id: uuidv4(),
        name: "Excavate and pour concrete for the building foundation.",
        status: { id: "in-progress", name: "In Progress" },
        iconID: "lampwork",
        description: "Excavate and pour concrete for the building foundation.",
      },
      {
        id: uuidv4(),
        name: "Install reinforcement steel",
        status: { id: "final-check", name: "Final Check" },
        iconID: "lampwork",
        description: "Install reinforcement steel",
      },
    ],
  },
  {
    id: uuidv4(),
    userId: DEMO_USER_ID,
    name: "Framing",
    description: "Construct the structural framework for walls and floors.",
    status: "awaiting",
    iconID: "lighting",
    coordinates: { x: 300, y: 250 },
    createdAt: "2024-06-01T08:10:00Z",
    updatedAt: "2024-06-01T08:10:00Z",
    checklist: [
      {
        id: uuidv4(),
        name: "Excavate and pour concrete for the building foundation.",
        status: { id: "in-progress", name: "In Progress" },
        iconID: "lampwork",
        description: "Excavate and pour concrete for the building foundation.",
      },
      {
        id: uuidv4(),
        name: "Install reinforcement steel",
        status: { id: "final-check", name: "Final Check" },
        iconID: "lampwork",
        description: "Install reinforcement steel",
      },
    ],
  },
  {
    id: uuidv4(),
    userId: DEMO_USER_ID,
    name: "Roof Installation",
    description: "Install trusses and roofing materials.",
    status: "in-progress",
    iconID: "electrical",
    coordinates: { x: 500, y: 180 },
    createdAt: "2024-06-01T08:20:00Z",
    updatedAt: "2024-06-01T08:20:00Z",
    checklist: [
      {
        id: uuidv4(),
        name: "Excavate and pour concrete for the building foundation.",
        status: { id: "in-progress", name: "In Progress" },
        iconID: "lampwork",
        description: "Excavate and pour concrete for the building foundation.",
      },
    ],
  },
  {
    id: uuidv4(),
    userId: DEMO_USER_ID,
    name: "Electrical Wiring",
    description: "Run electrical wiring and install panels/outlets.",
    status: "completed",
    iconID: "plumbing",
    coordinates: { x: 200, y: 400 },
    createdAt: "2024-06-01T08:30:00Z",
    updatedAt: "2024-06-01T08:30:00Z",
    checklist: [
      {
        id: uuidv4(),
        name: "Excavate and pour concrete for the building foundation.",
        status: { id: "in-progress", name: "In Progress" },
        iconID: "lampwork",
        description: "Excavate and pour concrete for the building foundation.",
      },
    ],
  },
  {
    id: uuidv4(),
    userId: DEMO_USER_ID,
    name: "Interior Finishing",
    description: "Install drywall, paint, and complete interior finishes.",
    status: "pending",
    iconID: "painting",
    coordinates: { x: 350, y: 350 },
    createdAt: "2024-06-01T08:40:00Z",
    updatedAt: "2024-06-01T08:40:00Z",
    checklist: [
      {
        id: uuidv4(),
        name: "Excavate and pour concrete for the building foundation.",
        status: { id: "in-progress", name: "In Progress" },
        iconID: "lampwork",
        description: "Excavate and pour concrete for the building foundation.",
      },
    ],
  },
];

export const taskConstantsObj: Record<string, IConstructTask> = taskConstants.reduce(
  (acc, task) => {
    acc[task.id] = task;
    return acc;
  },
  {} as Record<string, IConstructTask>,
);

import { z } from "zod";

export const editChecklistItemSchema = z.object({
  checklistItemName: z.string().min(1),
  checklistItemDescription: z.string().min(1),
  checklistItemStatus: z.string().min(1),
  checklistItemStatusName: z.string().min(1),
});

export const editTaskSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  taskDescription: z.string().min(1, "Task description is required"),
  taskStatus: z.enum(["awaiting", "pending", "in-progress", "completed"]),
  taskIconID: z.enum([
    "lampwork",
    "lighting",
    "electrical",
    "plumbing",
    "painting",
    "carpentry",
    "masonry",
    "flooring",
    "roofing",
    "walling",
    "ceiling",
    "doors",
    "windows",
    "other",
  ]),
  taskCoordinatesX: z.number().min(0),
  taskCoordinatesY: z.number().min(0),
});

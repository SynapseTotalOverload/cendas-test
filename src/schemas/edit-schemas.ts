import { z } from "zod";

export const editChecklistItemSchema = z.object({
  checklistItemName: z.string().min(1),
  checklistItemDescription: z.string().min(1),
  checklistItemStatus: z.string().min(1),
  checklistItemStatusName: z.string().min(1),
});

import { z } from "zod";

export const userSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  token: z.string().optional(),
});

export const createUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
});

export const updateUserSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1).optional(),
  token: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

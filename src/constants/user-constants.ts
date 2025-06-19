import type { IUser } from "@/types/user";
import { v4 as uuidv4 } from "uuid";

export const defaultUser: IUser = {
  id: uuidv4(),
  username: "admin",
  token: "admin-token-123",
};

// Keep the array for backward compatibility if needed elsewhere
export const userConstants: IUser[] = [defaultUser];

export const userConstantsObj: Record<string, IUser> = {
  [defaultUser.id]: defaultUser,
};

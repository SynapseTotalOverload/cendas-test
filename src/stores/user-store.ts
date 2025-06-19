import { createStore } from "zustand/vanilla";
import { combine, subscribeWithSelector } from "zustand/middleware";
import { toStream } from "@/lib/zustand-utils";
import type { IUser } from "@/types/user";
import { userSchema, type CreateUserInput, type LoginUserInput, type UpdateUserInput } from "@/schemas/user-schemas";

type TUserState = {
  users: IUser[];
  activeUser: IUser | null;
};

type TUserActions = {
  // User management
  addUser: (userData: CreateUserInput) => IUser;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, updates: UpdateUserInput) => void;
  getUserById: (userId: string) => IUser | null;
  getAllUsers: () => IUser[];
  setUsers: (users: IUser[]) => void;

  // Active user management
  loginUser: (username: string) => IUser | null;
  logoutUser: () => void;
  setActiveUser: (user: IUser | null) => void;
  getActiveUser: () => IUser | null;

  // Token management
  updateActiveUserToken: (token: string) => void;
  clearActiveUserToken: () => void;

  // Utility
  clearAllUsers: () => void;
  isUserLoggedIn: () => boolean;
};

export const useUserStore = createStore(
  subscribeWithSelector(
    combine<TUserState, TUserActions>({ users: [], activeUser: null }, (set, get) => ({
      // User management
      addUser: (userData: CreateUserInput) => {
        const newUser: IUser = {
          id: crypto.randomUUID(),
          username: userData.username,
        };

        set(state => ({
          users: [...state.users, newUser],
        }));

        return newUser;
      },

      removeUser: (userId: string) => {
        set(state => ({
          users: state.users.filter(user => user.id !== userId),
          activeUser: state.activeUser?.id === userId ? null : state.activeUser,
        }));
      },

      updateUser: (userId: string, updates: UpdateUserInput) => {
        set(state => ({
          users: state.users.map(user => (user.id === userId ? { ...user, ...updates } : user)),
          activeUser: state.activeUser?.id === userId ? { ...state.activeUser, ...updates } : state.activeUser,
        }));
      },

      getUserById: (userId: string) => {
        return get().users.find(user => user.id === userId) || null;
      },

      getAllUsers: () => get().users,

      setUsers: (users: IUser[]) => {
        set({ users });
      },

      // Active user management
      loginUser: (username: string) => {
        const { users } = get();
        const existingUser = users.find(user => user.username === username);

        if (existingUser) {
          set({ activeUser: { ...existingUser, token: "custom-token" } });
          return existingUser;
        } else {
          return null;
        }
      },

      logoutUser: () => {
        set({ activeUser: null });
      },

      setActiveUser: (user: IUser | null) => {
        set({ activeUser: user });
      },

      getActiveUser: () => get().activeUser,

      // Token management
      updateActiveUserToken: (token: string) => {
        const activeUser = get().activeUser;
        if (!activeUser) return;

        set(state => ({
          users: state.users.map(user => (user.id === activeUser.id ? { ...user, token } : user)),
          activeUser: { ...activeUser, token },
        }));
      },

      clearActiveUserToken: () => {
        const activeUser = get().activeUser;
        if (!activeUser) return;

        set(state => ({
          users: state.users.map(user => (user.id === activeUser.id ? { ...user, token: undefined } : user)),
          activeUser: { ...activeUser, token: undefined },
        }));
      },

      // Utility
      clearAllUsers: () => {
        set({ users: [], activeUser: null });
      },

      isUserLoggedIn: () => {
        return get().activeUser !== null;
      },
    })),
  ),
);

export const user$ = toStream(useUserStore, state => state.activeUser, {
  fireImmediately: true,
});

export const users$ = toStream(useUserStore, state => state.users, {
  fireImmediately: true,
});

import { createStore } from "zustand/vanilla";
import { combine, subscribeWithSelector } from "zustand/middleware";
import { toStream } from "@/lib/zustand-utils";
import type { IUser } from "@/types/user";

type TUserState = {
  user: IUser | null;
};

type TUserActions = {
  setUser: (user: IUser | null) => void;
  getUser: () => IUser | null;
  updateUser: (user: IUser) => void;
  clearUser: () => void;
  clearToken: () => void;
  updateUsername: (username: string) => void;
  updateToken: (token: string) => void;
};

export const useUserStore = createStore(
  subscribeWithSelector(
    combine<TUserState, TUserActions>({ user: null }, (set, get) => ({
      setUser: (user: IUser | null) =>
        set(() => ({
          user,
        })),
      getUser: () => get().user,
      updateUser: (user: IUser) =>
        set(() => ({
          user,
        })),
      clearUser: () => set({ user: null }),
      clearToken: () =>
        set(state => ({
          user: state.user ? { ...state.user, token: "" } : null,
        })),
      updateUsername: (username: string) =>
        set(state => ({
          user: state.user ? { ...state.user, username } : null,
        })),
      updateToken: (token: string) =>
        set(state => ({
          user: state.user ? { ...state.user, token } : null,
        })),
    })),
  ),
);

export const user$ = toStream(useUserStore, state => state.user, {
  fireImmediately: true,
});

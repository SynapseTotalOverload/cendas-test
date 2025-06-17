import { createStore } from "zustand/vanilla";
import { combine, subscribeWithSelector } from "zustand/middleware";
import { toStream } from "@/lib/zustand-utils";
import type { IConstructTask } from "@/types/construct-task";

type TConstructTasksState = {
  tasks: Record<string, IConstructTask>;
};

type TConstructTasksActions = {
  addTask: (task: IConstructTask) => void;
  getTask: (id: string) => IConstructTask | undefined;
  updateTask: (task: IConstructTask) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: IConstructTask[]) => void;
  clearTasks: () => void;
};

export const useConstructTasksStore = createStore(
  subscribeWithSelector(
    combine<TConstructTasksState, TConstructTasksActions>({ tasks: {} }, (set, get) => ({
      addTask: (task: IConstructTask) =>
        set(state => ({
          tasks: { ...state.tasks, [task.id]: task },
        })),
      getTask: (id: string) => get().tasks[id],
      updateTask: (task: IConstructTask) =>
        set(state => ({
          tasks: { ...state.tasks, [task.id]: task },
        })),
      deleteTask: (id: string) =>
        set(state => {
          const newTasks = { ...state.tasks };
          delete newTasks[id];
          return { tasks: newTasks };
        }),
      setTasks: (tasks: IConstructTask[]) =>
        set(() => {
          const tasksMap: Record<string, IConstructTask> = {};
          tasks.forEach((t: IConstructTask) => {
            tasksMap[t.id] = t;
          });
          return { tasks: tasksMap };
        }),
      clearTasks: () => set({ tasks: {} }),
    })),
  ),
);

export const tasks$ = toStream(useConstructTasksStore, state => Object.values(state.tasks), {
  fireImmediately: true,
});

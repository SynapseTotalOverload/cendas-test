import { createStore } from "zustand/vanilla";
import { combine, subscribeWithSelector } from "zustand/middleware";
import { toStream } from "@/lib/zustand-utils";
import type { IChecklistItem, IConstructTask, TChecklistStatuses, TConstructStatuses } from "@/types/construct-task";
import { taskConstantsObj } from "@/constants/task-constants";
import { useUserStore } from "./user-store";

type TConstructTasksState = {
  tasks: Record<string, IConstructTask>;
};

type TConstructTasksActions = {
  addTask: (task: IConstructTask) => void;
  getTask: (id: string) => IConstructTask | undefined;
  getFormattedTasks: () => IConstructTask[];
  getTasksByUserId: (userId: string) => IConstructTask[];
  updateTask: (task: IConstructTask) => void;
  updateTaskStatus: (id: string, status: TConstructStatuses) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: IConstructTask[]) => void;
  updateChecklistItem: (taskID: string, checklistItem: IChecklistItem) => void;
  updateChecklistItemStatus: (taskID: string, checklistItemID: string, status: TChecklistStatuses) => void;
  clearTasks: () => void;
  clearTasksByUserId: (userId: string) => void;
  deleteChecklistItem: (taskID: string, checklistItemID: string) => void;
  addChecklistItem: (taskID: string, checklistItem: IChecklistItem) => void;
};

export const useConstructTasksStore = createStore(
  subscribeWithSelector(
    combine<TConstructTasksState, TConstructTasksActions>({ tasks: taskConstantsObj }, (set, get) => ({
      addTask: (task: IConstructTask) =>
        set(state => {
          const activeUserId = useUserStore.getState().activeUser?.id;
          if (task.userId !== activeUserId) return state;
          return {
            tasks: { ...state.tasks, [task.id]: task },
          };
        }),

      getTask: (id: string) => get().tasks[id],
      getFormattedTasks: () => Object.values(get().tasks),
      getTasksByUserId: (userId: string) => Object.values(get().tasks).filter(task => task.userId === userId),
      updateTask: (task: IConstructTask) =>
        set(state => ({
          tasks: { ...state.tasks, [task.id]: task },
        })),
      updateTaskStatus: (id: string, status: TConstructStatuses) =>
        set(state => ({
          tasks: { ...state.tasks, [id]: { ...state.tasks[id], status } },
        })),
      deleteTask: (id: string) =>
        set(state => {
          const newTasks = { ...state.tasks };
          delete newTasks[id];
          return { tasks: newTasks };
        }),
      setTasks: (tasks: IConstructTask[]) =>
        set(() => {
          const activeUserId = useUserStore.getState().activeUser?.id;
          const tasksMap: Record<string, IConstructTask> = {};
          tasks.forEach((t: IConstructTask) => {
            if (!activeUserId || t.userId === activeUserId) {
              tasksMap[t.id] = t;
            }
          });
          return { tasks: tasksMap };
        }),
      clearTasks: () => set({ tasks: {} }),
      clearTasksByUserId: (userId: string) =>
        set(state => {
          const newTasks = { ...state.tasks };
          Object.keys(newTasks).forEach(taskId => {
            if (newTasks[taskId].userId === userId) {
              delete newTasks[taskId];
            }
          });
          return { tasks: newTasks };
        }),
      updateChecklistItem: (taskID: string, checklistItem: IChecklistItem) =>
        set(state => ({
          tasks: {
            ...state.tasks,
            [taskID]: {
              ...state.tasks[taskID],
              checklist: state.tasks[taskID].checklist.map(item =>
                item.id === checklistItem.id ? checklistItem : item,
              ),
            },
          },
        })),
      updateChecklistItemStatus: (taskID: string, checklistItemID: string, status: TChecklistStatuses) =>
        set(state => ({
          tasks: {
            ...state.tasks,
            [taskID]: {
              ...state.tasks[taskID],
              checklist: state.tasks[taskID].checklist.map(item =>
                item.id === checklistItemID ? { ...item, status: { id: status, name: status } } : item,
              ),
            },
          },
        })),
      deleteChecklistItem: (taskID: string, checklistItemID: string) =>
        set(state => ({
          tasks: {
            ...state.tasks,
            [taskID]: {
              ...state.tasks[taskID],
              checklist: state.tasks[taskID].checklist.filter(item => item.id !== checklistItemID),
            },
          },
        })),
      addChecklistItem: (taskID: string, checklistItem: IChecklistItem) =>
        set(state => ({
          tasks: {
            ...state.tasks,
            [taskID]: { ...state.tasks[taskID], checklist: [...state.tasks[taskID].checklist, checklistItem] },
          },
        })),
    })),
  ),
);

export const tasks$ = toStream(useConstructTasksStore, state => Object.values(state.tasks), {
  fireImmediately: true,
});

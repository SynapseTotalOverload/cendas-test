import { useEffect, useState } from "react";
import { useConstructTasksStore } from "@/stores/construct-tasks-store";
import { syncZustandToRxDB, syncRxDBToZustand } from "@/lib/sync-db";
import type { RxDatabase } from "rxdb";
import type { IConstructTask, TConstructStatuses } from "@/types/construct-task";
import { createDatabase } from "@/lib/db-init";

export default function App() {
  const [tasks, setTasks] = useState<IConstructTask[]>([]);
  const [db, setDb] = useState<RxDatabase | null>(null);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = useConstructTasksStore.subscribe(
      state => Object.values(state.tasks),
      tasks => setTasks(tasks),
    );

    // Initialize database and sync
    (async () => {
      const database = await createDatabase();
      setDb(database);

      syncZustandToRxDB(database);
      syncRxDBToZustand(database);
    })();

    return () => unsubscribe();
  }, []);

  const inspectDb = async () => {
    if (!db) return;

    // Dump entire collection
    const allDocs = await db.constructTasks.find().exec();
    console.log(
      "All RxDB Tasks:",
      allDocs.map(doc => doc.toJSON()),
    );
  };

  const addTestTask = () => {
    if (!newTaskName.trim()) return;

    const newTask: IConstructTask = {
      id: crypto.randomUUID(),
      name: newTaskName,
      description: "Test task description",
      status: "awaiting" as TConstructStatuses,
      iconID: "default-icon",
      coordinates: {
        x: Math.random() * 100,
        y: Math.random() * 100,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checklist: [],
    };

    useConstructTasksStore.getState().addTask(newTask);
    setNewTaskName("");
  };

  const toggleTaskStatus = (task: IConstructTask) => {
    const nextStatus: Record<TConstructStatuses, TConstructStatuses> = {
      awaiting: "pending",
      pending: "in-progress",
      "in-progress": "completed",
      completed: "awaiting",
    };

    useConstructTasksStore.getState().updateTask({
      ...task,
      status: nextStatus[task.status],
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteTask = (id: string) => {
    useConstructTasksStore.getState().deleteTask(id);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Construct Tasks Sync Test</h1>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newTaskName}
            onChange={e => setNewTaskName(e.target.value)}
            placeholder="Enter task name"
            className="px-4 py-2 border rounded flex-1"
            onKeyDown={e => e.key === "Enter" && addTestTask()}
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={addTestTask}>
            Add Task
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded">
              <button
                onClick={() => toggleTaskStatus(task)}
                className={`px-3 py-1 rounded ${
                  task.status === "completed"
                    ? "bg-green-500"
                    : task.status === "in-progress"
                      ? "bg-yellow-500"
                      : task.status === "pending"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                } text-white`}>
                {task.status}
              </button>
              <span className="flex-1">
                {task.name}
                <span className="text-sm text-gray-500 ml-2">({task.description})</span>
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <h2 className="text-xl font-semibold">Debug Tools</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600" onClick={inspectDb}>
              Inspect RxDB (check console)
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => useConstructTasksStore.getState().clearTasks()}>
              Clear All Tasks
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">
            Open your browser's console to see the sync logs between RxDB and Zustand
          </p>
          <pre className="text-sm bg-white p-2 rounded mt-2">{JSON.stringify(tasks, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

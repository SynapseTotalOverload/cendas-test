import { tasks$, useConstructTasksStore } from "@/stores/construct-tasks-store";
import type { RxDatabase } from "rxdb";
import type { IConstructTask } from "@/types/construct-task";

let syncingFromZustand = false;
let syncingFromRxDB = false;

export async function syncZustandToRxDB(db: RxDatabase) {
  const constructTasksCollection = db.constructTasks;

  tasks$.subscribe(async tasks => {
    if (syncingFromRxDB) return; // skip if change came from RxDB sync

    syncingFromZustand = true;
    try {
      // Batch upsert all tasks
      const upsertPromises = tasks.map(task => constructTasksCollection.upsert(task));
      await Promise.all(upsertPromises);
      console.log("Synced tasks to RxDB:", tasks.length);
    } finally {
      syncingFromZustand = false;
    }
  });
}

export function syncRxDBToZustand(db: RxDatabase) {
  const constructTasksCollection = db.constructTasks;

  constructTasksCollection.find().$.subscribe(docs => {
    if (syncingFromZustand) return; // skip if change came from Zustand sync

    syncingFromRxDB = true;
    try {
      const tasks = docs.map(doc => doc.toJSON() as IConstructTask);
      useConstructTasksStore.getState().setTasks(tasks);
      console.log("Synced tasks from RxDB to Zustand:", tasks.length);
    } finally {
      syncingFromRxDB = false;
    }
  });
}

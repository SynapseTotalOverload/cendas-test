import { tasks$, useConstructTasksStore } from "@/stores/construct-tasks-store";
import { user$, useUserStore } from "@/stores/user-store";
import type { RxDatabase } from "rxdb";
import type { IConstructTask } from "@/types/construct-task";
import type { IUser } from "@/types/user";

let syncingFromZustand = false;
let syncingFromRxDB = false;
let syncingUserFromZustand = false;
let syncingUserFromRxDB = false;

export async function syncZustandToRxDB(db: RxDatabase) {
  const constructTasksCollection = db.constructTasks;
  const userCollection = db.user;

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

  user$.subscribe(async user => {
    if (syncingUserFromRxDB) return; // skip if change came from RxDB sync

    syncingUserFromZustand = true;
    try {
      if (user) {
        await userCollection.upsert(user);

        console.log("Synced user to RxDB:", user.username);
      } else {
        // Clear user from database if null
        await userCollection.remove();
        console.log("Cleared user from RxDB");
      }
    } finally {
      syncingUserFromZustand = false;
    }
  });
}

export function syncRxDBToZustand(db: RxDatabase) {
  const constructTasksCollection = db.constructTasks;
  const userCollection = db.user;

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

  userCollection.find().$.subscribe(docs => {
    if (syncingUserFromZustand) return; // skip if change came from Zustand sync

    syncingUserFromRxDB = true;
    try {
      const user = docs.length > 0 ? (docs[0].toJSON() as IUser) : null;
      useUserStore.getState().setUser(user);
      console.log("Synced user from RxDB to Zustand:", user?.username || "null");
    } finally {
      syncingUserFromRxDB = false;
    }
  });
}

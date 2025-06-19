import { tasks$, useConstructTasksStore } from "@/stores/construct-tasks-store";
import { users$, user$, useUserStore } from "@/stores/user-store";
import type { RxDatabase } from "rxdb";
import type { IConstructTask } from "@/types/construct-task";
import type { IUser } from "@/types/user";

let syncingFromZustand = false;
let syncingFromRxDB = false;
let syncingUsersFromZustand = false;
let syncingUsersFromRxDB = false;
let syncingActiveUserFromZustand = false;
let syncingActiveUserFromRxDB = false;

export async function syncZustandToRxDB(db: RxDatabase) {
  const constructTasksCollection = db.constructTasks;
  const usersCollection = db.users;
  const activeUserCollection = db.activeUser;

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

  users$.subscribe(async users => {
    if (syncingUsersFromRxDB) return; // skip if change came from RxDB sync

    syncingUsersFromZustand = true;
    try {
      // Clear existing users and add all current ones
      await usersCollection.remove();

      if (users.length > 0) {
        const insertPromises = users.map(user => usersCollection.insert(user));
        await Promise.all(insertPromises);
        console.log("Synced users to RxDB:", users.length);
      }
    } finally {
      syncingUsersFromZustand = false;
    }
  });

  user$.subscribe(async activeUser => {
    if (syncingActiveUserFromRxDB) return; // skip if change came from RxDB sync

    syncingActiveUserFromZustand = true;
    try {
      // Clear existing active user
      await activeUserCollection.remove();

      if (activeUser) {
        const activeUserDoc = {
          id: "active-user",
          userId: activeUser.id,
          username: activeUser.username,
          token: activeUser.token,
          lastLoginAt: new Date().toISOString(),
        };

        await activeUserCollection.insert(activeUserDoc);
        console.log("Synced active user to RxDB:", activeUser.username);
      } else {
        console.log("Cleared active user from RxDB");
      }
    } finally {
      syncingActiveUserFromZustand = false;
    }
  });
}

export function syncRxDBToZustand(db: RxDatabase) {
  const constructTasksCollection = db.constructTasks;
  const usersCollection = db.users;
  const activeUserCollection = db.activeUser;

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

  usersCollection.find().$.subscribe(docs => {
    if (syncingUsersFromZustand) return; // skip if change came from Zustand sync

    syncingUsersFromRxDB = true;
    try {
      const users = docs.map(doc => doc.toJSON() as IUser);
      useUserStore.getState().setUsers(users);
      console.log("Synced users from RxDB to Zustand:", users.length);
    } finally {
      syncingUsersFromRxDB = false;
    }
  });

  activeUserCollection.find().$.subscribe(docs => {
    if (syncingActiveUserFromZustand) return; // skip if change came from Zustand sync

    syncingActiveUserFromRxDB = true;
    try {
      if (docs.length > 0) {
        const activeUserDoc = docs[0].toJSON();
        const activeUser: IUser = {
          id: activeUserDoc.userId,
          username: activeUserDoc.username,
          token: activeUserDoc.token,
        };
        useUserStore.getState().setActiveUser(activeUser);
        console.log("Synced active user from RxDB to Zustand:", activeUser.username);
      } else {
        useUserStore.getState().setActiveUser(null);
        console.log("Synced active user from RxDB to Zustand: null");
      }
    } finally {
      syncingActiveUserFromRxDB = false;
    }
  });
}

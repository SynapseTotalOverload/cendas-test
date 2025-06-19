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
  await revealRxDBState(db);
  const constructTasksCollection = db.constructTasks;
  const usersCollection = db.users;
  const activeUserCollection = db.activeUser;

  tasks$.subscribe(async tasks => {
    await revealRxDBState(db);
    if (syncingFromRxDB) return; // skip if change came from RxDB sync
    console.log("[Zustand->RxDB] Synced tasks:", tasks.length);

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
      console.log("[Zustand->RxDB] Synced users:", users.length);
      // Clear existing users and add all current ones
      await usersCollection.find().remove();

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
      console.log("[Zustand->RxDB] Synced active user:", activeUser);
      // Clear existing active user
      await activeUserCollection.find().remove();

      if (activeUser) {
        const activeUserDoc = {
          id: "active-user",
          userId: activeUser.id,
          username: activeUser.username,
          token: activeUser.token,
          lastLoginAt: new Date().toISOString(),
        };

        await activeUserCollection.upsert(activeUserDoc);
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

  // Load initial tasks, then subscribe
  (async () => {
    const initialTasks = await constructTasksCollection.find().exec();
    useConstructTasksStore.getState().setTasks(initialTasks.map(doc => doc.toJSON() as IConstructTask));

    constructTasksCollection.find().$.subscribe(docs => {
      if (syncingFromZustand) return;
      console.log("[RxDB->Zustand] Synced tasks:", docs.length);
      syncingFromRxDB = true;
      try {
        const tasks = docs.map(doc => doc.toJSON() as IConstructTask);
        useConstructTasksStore.getState().setTasks(tasks);
        console.log("Synced tasks from RxDB to Zustand:", tasks.length);
      } finally {
        syncingFromRxDB = false;
      }
    });
  })();

  // Load initial users, then subscribe
  (async () => {
    const initialUsers = await usersCollection.find().exec();
    useUserStore.getState().setUsers(initialUsers.map(doc => doc.toJSON() as IUser));

    usersCollection.find().$.subscribe(docs => {
      if (syncingUsersFromZustand) return;
      console.log("[RxDB->Zustand] Synced users:", docs.length);
      syncingUsersFromRxDB = true;
      try {
        const users = docs.map(doc => doc.toJSON() as IUser);
        useUserStore.getState().setUsers(users);
        console.log("Synced users from RxDB to Zustand:", users.length);
      } finally {
        syncingUsersFromRxDB = false;
      }
    });
  })();

  // Load initial active user, then subscribe
  (async () => {
    const initialActiveUserDocs = await activeUserCollection.find().exec();
    if (initialActiveUserDocs.length > 0) {
      const activeUserDoc = initialActiveUserDocs[0].toJSON();
      useUserStore.getState().setActiveUser({
        id: activeUserDoc.userId,
        username: activeUserDoc.username,
        token: activeUserDoc.token,
      });
    } else {
      useUserStore.getState().setActiveUser(null);
    }

    activeUserCollection.find().$.subscribe(docs => {
      if (syncingActiveUserFromZustand) return;
      console.log("[RxDB->Zustand] Synced active user:", docs.length);
      syncingActiveUserFromRxDB = true;
      try {
        if (docs.length > 0) {
          const activeUserDoc = docs[0].toJSON();
          useUserStore.getState().setActiveUser({
            id: activeUserDoc.userId,
            username: activeUserDoc.username,
            token: activeUserDoc.token,
          });
          console.log("Synced active user from RxDB to Zustand:", activeUserDoc.username);
        } else {
          useUserStore.getState().setActiveUser(null);
          console.log("Synced active user from RxDB to Zustand: null");
        }
      } finally {
        syncingActiveUserFromRxDB = false;
      }
    });
  })();
}

export async function revealRxDBState(db: RxDatabase) {
  const constructTasks = await db.constructTasks.find().exec();
  const users = await db.users.find().exec();
  const activeUserDocs = await db.activeUser.find().exec();

  console.log(
    "Current tasks in RxDB:",
    constructTasks.map(doc => doc.toJSON()),
  );
  console.log(
    "Current users in RxDB:",
    users.map(doc => doc.toJSON()),
  );
  console.log("Current active user in RxDB:", activeUserDocs.length > 0 ? activeUserDocs[0].toJSON() : null);
}

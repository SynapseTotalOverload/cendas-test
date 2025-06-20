import { tasks$, useConstructTasksStore } from "@/stores/construct-tasks-store";
import { users$, user$, useUserStore } from "@/stores/user-store";
import type { RxDatabase } from "rxdb";
import type { IConstructTask } from "@/types/construct-task";
import type { IUser } from "@/types/user";

export let syncingFromZustand = false;
export let syncingFromRxDB = false;
export let syncingUsersFromZustand = false;
export let syncingUsersFromRxDB = false;
export let syncingActiveUserFromZustand = false;
export let syncingActiveUserFromRxDB = false;

export async function syncZustandToRxDB(db: RxDatabase) {
  await revealRxDBState(db);
  const constructTasksCollection = db.constructTasks;
  const usersCollection = db.users;
  const activeUserCollection = db.activeUser;

  tasks$.subscribe(async tasks => {
    await revealRxDBState(db);
    if (syncingFromRxDB) return;
    console.log("[Zustand->RxDB] Synced tasks:", tasks.length);

    syncingFromZustand = true;
    try {
      const existingTasks = await constructTasksCollection.find().exec();
      const existingTaskIds = new Set(existingTasks.map(doc => doc.get("id")));

      const newTasks = tasks.filter(task => !existingTaskIds.has(task.id));

      const upsertPromises = tasks.map(task => constructTasksCollection.upsert(task));
      await Promise.all(upsertPromises);

      console.log("Synced tasks to RxDB:", tasks.length, `(${newTasks.length} new)`);
    } finally {
      syncingFromZustand = false;
    }
  });

  users$.subscribe(async users => {
    if (syncingUsersFromZustand) return;

    syncingUsersFromZustand = true;
    try {
      console.log("[Zustand->RxDB] Synced users:", users.length);

      const existingUsers = await usersCollection.find().exec();
      const existingUserIds = new Set(existingUsers.map(doc => doc.get("id")));

      const newUsers = users.filter(user => !existingUserIds.has(user.id));

      if (newUsers.length > 0) {
        const insertPromises = newUsers.map(user => usersCollection.insert(user));
        await Promise.all(insertPromises);
        console.log("Synced users to RxDB:", newUsers.length, "new users");
      }
    } finally {
      syncingUsersFromZustand = false;
    }
  });

  user$.subscribe(async activeUser => {
    if (syncingActiveUserFromZustand) return;

    syncingActiveUserFromZustand = true;
    try {
      console.log("[Zustand->RxDB] Synced active user:", activeUser);

      if (activeUser) {
        const activeUserDoc = {
          id: "active-user",
          userId: activeUser.id,
          username: activeUser.username,
          token: activeUser.token,
          lastLoginAt: new Date().toISOString(),
        };

        await activeUserCollection.upsert(activeUserDoc);
        updateUserTasks(db, activeUser.id);
        console.log("Synced active user to RxDB:", activeUser.username);
      } else {
        await activeUserCollection.find().remove();

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

  (async () => {
    const activeUser = useUserStore.getState().activeUser;
    const initialTasks = await constructTasksCollection.find().exec();

    const userTasks = activeUser ? initialTasks.filter(doc => doc.get("userId") === activeUser.id) : [];

    useConstructTasksStore.getState().setTasks(userTasks.map(doc => doc.toJSON() as IConstructTask));

    constructTasksCollection.find().$.subscribe(docs => {
      if (syncingFromZustand) return;
      console.log("[RxDB->Zustand] Synced tasks:", docs.length);
      syncingFromRxDB = true;
      try {
        const currentUser = useUserStore.getState().activeUser;

        const filteredTasks = currentUser ? docs.filter(doc => doc.get("userId") === currentUser.id) : [];

        const tasks = filteredTasks.map(doc => doc.toJSON() as IConstructTask);
        useConstructTasksStore.getState().setTasks(tasks);
        console.log(
          "Synced tasks from RxDB to Zustand:",
          tasks.length,
          `(filtered for user: ${currentUser?.username || "none"})`,
        );
      } finally {
        syncingFromRxDB = false;
      }
    });
  })();

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

export async function getTasksByUserId(db: RxDatabase, userId: string): Promise<IConstructTask[]> {
  const tasks = await db.constructTasks
    .find({
      selector: { userId },
    })
    .exec();
  return tasks.map(doc => doc.toJSON() as IConstructTask);
}

export async function syncTasksByUserId(db: RxDatabase, userId: string) {
  const tasks = await getTasksByUserId(db, userId);
  useConstructTasksStore.getState().setTasks(tasks);
  return tasks;
}

export async function clearTasksByUserId(db: RxDatabase, userId: string) {
  await db.constructTasks
    .find({
      selector: { userId },
    })
    .remove();
  useConstructTasksStore.getState().clearTasksByUserId(userId);
}

export async function clearAllData(db: RxDatabase) {
  console.log("🧹 Clearing all data from RxDB...");

  try {
    await db.constructTasks.find().remove();
    await db.users.find().remove();
    await db.activeUser.find().remove();

    useConstructTasksStore.getState().clearTasks();
    useUserStore.getState().clearAllUsers();

    console.log("✅ All data cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    throw error;
  }
}

export async function destroyDatabase(db: RxDatabase) {
  console.log("🗑️ Destroying database completely...");

  try {
    await db.constructTasks.find().remove();
    await db.users.find().remove();
    await db.activeUser.find().remove();

    useConstructTasksStore.getState().clearTasks();
    useUserStore.getState().clearAllUsers();

    console.log("✅ Database cleared successfully");
  } catch (error) {
    console.error("❌ Error destroying database:", error);
    throw error;
  }
}

export async function updateUserTasks(db: RxDatabase, userId: string) {
  const tasks = await getTasksByUserId(db, userId);
  console.log("Updating user tasks:", tasks.length);
  useConstructTasksStore.getState().setTasks(tasks);
  return tasks;
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

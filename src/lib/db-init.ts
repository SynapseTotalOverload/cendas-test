import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

addRxPlugin(RxDBDevModePlugin);

const constructTaskSchema = {
  title: "construct-task",
  description: "Schema for a construct task with checklist",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
      maxLength: 255,
    },
    description: {
      type: "string",
    },
    status: {
      type: "string",
      enum: ["awaiting", "pending", "in-progress", "completed"],
      maxLength: 20,
    },
    iconID: {
      type: "string",
      maxLength: 100,
    },
    coordinates: {
      type: "object",
      properties: {
        x: { type: "number" },
        y: { type: "number" },
      },
      required: ["x", "y"],
    },
    createdAt: {
      type: "string",
      maxLength: 30, // ISO date string
    },
    updatedAt: {
      type: "string",
      maxLength: 30, // ISO date string
    },
    checklist: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", maxLength: 100 },
          iconID: { type: "string", maxLength: 100 },
          name: { type: "string" },
          description: { type: "string" },
          status: {
            type: "object",
            properties: {
              id: {
                type: "string",
                enum: ["not-started", "in-progress", "blocked", "final-check", "awaiting", "done"],
                maxLength: 20,
              },
              name: { type: "string" },
            },
            required: ["id", "name"],
          },
        },
        required: ["id", "iconID", "name", "description", "status"],
      },
    },
  },
  required: ["id", "name", "description", "status", "iconID", "coordinates", "createdAt", "updatedAt", "checklist"],
  indexes: ["status", "createdAt", "updatedAt"],
};

const userSchema = {
  title: "user",
  description: "Schema for a single user with authentication",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    username: {
      type: "string",
      maxLength: 255,
    },
    token: {
      type: "string",
      maxLength: 500,
    },
  },
  required: ["id", "username", "token"],
  indexes: ["username"],
};

const activeUserSchema = {
  title: "active-user",
  description: "Schema for tracking the currently active user",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    userId: {
      type: "string",
      maxLength: 100,
    },
    username: {
      type: "string",
      maxLength: 255,
    },
    token: {
      type: "string",
      maxLength: 500,
    },
    lastLoginAt: {
      type: "string",
      maxLength: 30, // ISO date string
    },
  },
  required: ["id", "userId", "username", "token"],
  indexes: ["userId", "username"],
};

export async function createDatabase() {
  const storage = wrappedValidateAjvStorage({
    storage: getRxStorageDexie(),
  });

  const db = await createRxDatabase({
    name: "construct-tasks",
    storage,
    multiInstance: false,
    eventReduce: true,
    ignoreDuplicate: true,
  });

  await db.addCollections({
    constructTasks: {
      schema: constructTaskSchema,
    },
    users: {
      schema: userSchema,
    },
    activeUser: {
      schema: activeUserSchema,
    },
  });

  return db;
}

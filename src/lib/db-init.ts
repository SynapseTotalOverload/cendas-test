import { createRxDatabase, addRxPlugin } from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";

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
                enum: [
                  "blocked",
                  "pending",
                  "in-progress",
                  "completed",
                  "not-applicable",
                  "not-started",
                  "not-required",
                ],
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

export async function createDatabase() {
  const storage = wrappedValidateAjvStorage({
    storage: getRxStorageMemory(),
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
  });

  return db;
}

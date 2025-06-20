import { BrowserRouter, Routes, Route } from "react-router"; // note react-router-dom
import ConstructMainScreen from "./construct-main-screen";
import { useEffect, useRef } from "react";
import { createDatabase } from "@/lib/db-init";
import { syncZustandToRxDB, syncRxDBToZustand } from "@/lib/sync-db";
import ConstructTableView from "./construct-table-view";
import { ProtectedRoute } from "@/modules/protected-route";
import Login from "@/pages/login";
import Register from "@/pages/register";
import type { RxDatabase } from "rxdb";

let dbPromise: Promise<RxDatabase> | null = null;

function getDatabase() {
  if (!dbPromise) {
    dbPromise = createDatabase();
  }
  return dbPromise;
}
export default function App() {
  const hydrationRef = useRef(false);
  useEffect(() => {
    (async () => {
      const db = await getDatabase();
      // destroyDatabase(db);
      if (!hydrationRef.current) {
        syncRxDBToZustand(db);

        syncZustandToRxDB(db);
      }
      hydrationRef.current = true;
    })();

    // No subscription here if you don't need to react to changes in this component
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ConstructMainScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/table-view"
          element={
            <ProtectedRoute>
              <ConstructTableView />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

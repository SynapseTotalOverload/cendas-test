import { BrowserRouter, Routes, Route } from "react-router"; // note react-router-dom
import ConstructMainScreen from "./construct-main-screen";
import { useEffect } from "react";
import { createDatabase } from "@/lib/db-init";
import { syncZustandToRxDB, syncRxDBToZustand } from "@/lib/sync-db";
import ConstructTableView from "./construct-table-view";
import { ProtectedRoute } from "@/modules/protected-route";
import Login from "@/pages/login";
import Register from "@/pages/register";

export default function App() {
  useEffect(() => {
    (async () => {
      const db = await createDatabase();

      syncZustandToRxDB(db);
      syncRxDBToZustand(db);
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

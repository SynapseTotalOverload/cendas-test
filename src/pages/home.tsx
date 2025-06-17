import { BrowserRouter, Routes, Route } from "react-router"; // note react-router-dom
import ConstructMainScreen from "./construct-main-screen";
import { useEffect } from "react";
import { createDatabase } from "@/lib/db-init";
import { syncZustandToRxDB, syncRxDBToZustand } from "@/lib/sync-db";
import ConstructTableView from "./construct-table-view";

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
        <Route path="/" element={<ConstructMainScreen />} />
        <Route path="/table-view" element={<ConstructTableView />} />
      </Routes>
    </BrowserRouter>
  );
}

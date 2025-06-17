import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/home.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import ConstructMainScreen from "./pages/construct-main-screen.tsx";
import App from "./pages/home.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

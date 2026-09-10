import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BoardServiceProvider } from "./context/BoardServiceContext.jsx";

async function initApp() {
  let baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch("/config.json");
    if (response.ok) {
      const config = await response.json();
      if (config.VITE_API_BASE_URL) {
        baseUrl = config.VITE_API_BASE_URL;
      }
    }
  } catch (error) {
    console.warn("Failed to load runtime config, falling back to build-time env:", error);
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BoardServiceProvider baseUrl={baseUrl}>
        <App />
      </BoardServiceProvider>
    </StrictMode>
  );
}

initApp();

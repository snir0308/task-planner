import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BoardServiceProvider } from "./context/BoardServiceContext.jsx";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BoardServiceProvider baseUrl={baseUrl}>
      <App />
    </BoardServiceProvider>
  </StrictMode>
);

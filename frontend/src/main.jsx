import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BoardServiceProvider } from "./context/BoardServiceContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BoardServiceProvider>
      <App />
    </BoardServiceProvider>
  </StrictMode>
);

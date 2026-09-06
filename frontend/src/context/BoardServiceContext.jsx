import React, { createContext, useContext } from "react";
import { LocalStorageBoardService } from "../services/LocalStorageBoardService.js";

const BoardServiceContext = createContext(null);

/**
 * @component BoardServiceProvider
 * @description Provides the BoardService to the application.
 * @param {Object} props
 * @param {import("../services/BoardService.js").BoardService} [props.service] - An optional service implementation.
 */
export function BoardServiceProvider({ children, service }) {
  // Use the provided service or default to LocalStorageBoardService
  const boardService = service || new LocalStorageBoardService();

  return (
    <BoardServiceContext.Provider value={boardService}>
      {children}
    </BoardServiceContext.Provider>
  );
}

/**
 * @hook useBoardService
 * @description Custom hook to access the BoardService.
 * @returns {import("../services/BoardService.js").BoardService}
 */
export function useBoardService() {
  const context = useContext(BoardServiceContext);
  if (!context) {
    throw new Error("useBoardService must be used within a BoardServiceProvider");
  }
  return context;
}

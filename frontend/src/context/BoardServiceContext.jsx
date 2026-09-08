import React, { createContext, useContext } from "react";
import { BackendBoardService } from "../services/BackendBoardService.js";

const BoardServiceContext = createContext(null);

/**
 * @component BoardServiceProvider
 * @description Provides the BoardService to the application.
 * @param {Object} props
 * @param {import("../services/BoardService.js").BoardService} [props.service] - An optional service implementation.
 * @param {string} [props.baseUrl] - The base URL for the backend service.
 */
export function BoardServiceProvider({ children, service, baseUrl }) {
  // Use the provided service, or determine based on environment/props
  const getService = () => {
    if (service) return service;
    
    return new BackendBoardService(baseUrl);
  };

  // Use useMemo or similar if we wanted to be more efficient, 
  // but for this task we'll just instantiate it.
  const boardService = getService();

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

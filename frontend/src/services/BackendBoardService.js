import { BoardService } from "./BoardService.js";
import { useBoardStore } from "../store/useBoardStore.js";

/**
 * @class BackendBoardService
 * @extends BoardService
 * @description Implementation of BoardService using the remote backend API.
 */
export class BackendBoardService extends BoardService {
  /**
   * @param {string} baseUrl - The base URL of the backend API.
   */
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
    this._loadCredentials();
  }

  /**
   * @private
   */
  _loadCredentials() {
    this.boardId = localStorage.getItem("board_id");
    this.editToken = localStorage.getItem("edit_token");
    if (this.boardId || this.editToken) {
      useBoardStore.getState().setBoard(null, this.boardId, this.editToken);
    }
  }

  /**
   * @private
   */
  _saveCredentials() {
    if (this.boardId) localStorage.setItem("board_id", this.boardId);
    if (this.editToken) localStorage.setItem("edit_token", this.editToken);
  }

  async _fetchBoard(boardId) {
    const response = await fetch(`${this.baseUrl}/board/${boardId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  /**
   * @private
   */
  async _getBoardWithCache(boardId) {
    const { board, boardId: storedBoardId } = useBoardStore.getState();
    if (board && storedBoardId === boardId) {
      return board;
    }
    const boardData = await this._fetchBoard(boardId);
    if (boardData) {
      useBoardStore.getState().setBoard(boardData, boardId, this.editToken);
    }
    return boardData;
  }

  async _updateBoard(boardId, boardData) {
    const response = await fetch(`${this.baseUrl}/board/${boardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board: boardData })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async register(editToken) {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ editToken })
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    const { boardId } = await response.json();
    this.boardId = boardId;
    this.editToken = editToken;
    this._saveCredentials();
    useBoardStore.getState().setBoard(null, this.boardId, this.editToken);
    return boardId;
  }

  async getBoardState(boardId) {
    return await this._getBoardWithCache(boardId);
  }

  async validateEditToken(boardId, editToken) {
    const response = await fetch(`${this.baseUrl}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId, editToken })
    });
    const { isValid } = await response.json();
    return isValid;
  }

  async getTasks() {
    if (!this.boardId) return [];
    const board = await this._getBoardWithCache(this.boardId);
    return board ? (board.tasks || []) : [];
  }

  async setTasks(tasks) {
    if (!this.boardId) throw new Error("No boardId available. Please register first.");
    const board = await this._getBoardWithCache(this.boardId);
    if (!board) throw new Error("Board not found.");
    
    const updatedBoard = { ...board, tasks };
    await this._updateBoard(this.boardId, updatedBoard);
    useBoardStore.getState().updateBoardField('tasks', tasks);
  }

  async getProfileImage() {
    if (!this.boardId) return "";
    const board = await this._getBoardWithCache(this.boardId);
    return board ? (board.profileImage || "") : "";
  }

  async setProfileImage(url) {
    if (!this.boardId) throw new Error("No boardId available.");
    const board = await this._getBoardWithCache(this.boardId);
    if (!board) throw new Error("Board not found.");
    
    await this._updateBoard(this.boardId, { ...board, profileImage: url });
    useBoardStore.getState().updateBoardField('profileImage', url);
  }

  async getPurposeStatement() {
    if (!this.boardId) return "";
    const board = await this._getBoardWithCache(this.boardId);
    return board ? (board.purposeStatement || "") : "";
  }

  async setPurposeStatement(statement) {
    if (!this.boardId) throw new Error("No boardId available.");
    const board = await this._getBoardWithCache(this.boardId);
    if (!board) throw new Error("Board not found.");
    
    await this._updateBoard(this.boardId, { ...board, purposeStatement: statement });
    useBoardStore.getState().updateBoardField('purposeStatement', statement);
  }

  async getLastBackup() {
    if (!this.boardId) return null;
    const board = await this._getBoardWithCache(this.boardId);
    return board ? (board.lastBackup || null) : null;
  }

  async setLastBackup(timestamp) {
    if (!this.boardId) throw new Error("No boardId available.");
    const board = await this._getBoardWithCache(this.boardId);
    if (!board) throw new Error("Board not found.");
    
    await this._updateBoard(this.boardId, { ...board, lastBackup: timestamp });
    useBoardStore.getState().updateBoardField('lastBackup', timestamp);
  }

  async getDisplayName() {
    if (!this.boardId) return "";
    const board = await this._getBoardWithCache(this.boardId);
    return board ? (board.displayName || "") : "";
  }

  async setDisplayName(name) {
    if (!this.boardId) throw new Error("No boardId available.");
    const board = await this._getBoardWithCache(this.boardId);
    if (!board) throw new Error("Board not found.");
    
    await this._updateBoard(this.boardId, { ...board, displayName: name });
    useBoardStore.getState().updateBoardField('displayName', name);
  }

  async getFavorites() {
    if (!this.boardId) return [];
    const board = await this._getBoardWithCache(this.boardId);
    return board ? (board.favorites || []) : [];
  }

  async setFavorites(favorites) {
    if (!this.boardId) throw new Error("No boardId available.");
    const board = await this._getBoardWithCache(this.boardId);
    if (!board) throw new Error("Board not found.");
    
    await this._updateBoard(this.boardId, { ...board, favorites });
    useBoardStore.getState().updateBoardField('favorites', favorites);
  }

  async addFavorite(favoriteData) {
    if (!this.boardId) throw new Error("No boardId available.");
    const board = await this._getBoardWithCache(this.boardId);
    if (!board) throw new Error("Board not found.");
    
    const newFavorite = {
      id: crypto.randomUUID(),
      ...favoriteData
    };
    const updatedFavorites = [...(board.favorites || []), newFavorite];
    await this._updateBoard(this.boardId, { ...board, favorites: updatedFavorites });
    useBoardStore.getState().updateBoardField('favorites', updatedFavorites);
  }

  async deleteFavorite(id) {
    if (!this.boardId) throw new Error("No boardId available.");
    const board = await this._getBoardWithCache(this.boardId);
    if (!board) throw new Error("Board not found.");

    const updatedFavorites = (board.favorites || []).filter(f => f.id !== id);
    await this._updateBoard(this.boardId, { ...board, favorites: updatedFavorites });
    useBoardStore.getState().updateBoardField('favorites', updatedFavorites);
  }

  async editFavorite(id, favoriteData) {
    if (!this.boardId) throw new Error("No boardId available.");
    const board = await this._getBoardWithCache(this.boardId);
    if (!board) throw new Error("Board not found.");

    const updatedFavorites = (board.favorites || []).map(f => 
      f.id === id ? { ...f, ...favoriteData } : f
    );
    await this._updateBoard(this.boardId, { ...board, favorites: updatedFavorites });
    useBoardStore.getState().updateBoardField('favorites', updatedFavorites);
  }

  /**
   * Sets the entire board state by updating the remote backend.
   * @param {Object} boardData - The new board state.
   * @returns {Promise<void>}
   */
  async setBoardState(boardData) {
    if (!this.boardId) throw new Error("No boardId available. Please register first.");

    // Sync internal credentials if they have changed in the new board data
    if (boardData.boardId && boardData.boardId !== this.boardId) {
      this.boardId = boardData.boardId;
      this._saveCredentials();
    }
    if (boardData.editToken && boardData.editToken !== this.editToken) {
      this.editToken = boardData.editToken;
      this._saveCredentials();
    }

    await this._updateBoard(this.boardId, boardData);
    useBoardStore.getState().setBoard(boardData, boardData.boardId, boardData.editToken);
  }
}

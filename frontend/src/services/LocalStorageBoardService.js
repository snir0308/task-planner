import { BoardService } from "./BoardService.js";

/**
 * @class LocalStorageBoardService
 * @extends BoardService
 * @description Implementation of BoardService using localStorage.
 */
export class LocalStorageBoardService extends BoardService {
  /**
   * @private
   * @returns {Promise<Object>} The complete board state from localStorage.
   */
  async _getBoardState() {
    const stored = localStorage.getItem("matrix-board-state");
     return stored ? JSON.parse(stored) : {
       tasks: [],
       profileImage: "",
       purposeStatement: "",
       displayName: "",
       lastBackup: null,
       favorites: [],
       editToken: "",
       boardId: ""
     };

  }

  /**
   * Retrieves the board state for a given board ID.
   * @param {string} boardId - The ID of the board.
   * @returns {Promise<Object|null>} A promise that resolves to the board state, or null if not found.
   */
  async getBoardState(boardId) {
    const board = await this._getBoardState();
    return board.boardId === boardId ? board : null;
  }

  /**
   * @private
   * @param {Object} board - The board object to save.
   * @returns {Promise<void>}
   */
  async _saveBoardState(board) {
    localStorage.setItem("matrix-board-state", JSON.stringify(board));
  }

  /**
   * @returns {Promise<Array<Object>>}
   */
  async getTasks() {
    const board = await this._getBoardState();
    return board.tasks || [];
  }

  /**
   * @param {Array<Object>} tasks
   */
  async setTasks(tasks) {
    const board = await this._getBoardState();
    board.tasks = tasks;
    await this._saveBoardState(board);
  }

  /**
   * @returns {Promise<string>}
   */
  async getProfileImage() {
    const board = await this._getBoardState();
    return board.profileImage || "";
  }

  /**
   * @param {string} url
   */
  async setProfileImage(url) {
    const board = await this._getBoardState();
    board.profileImage = url;
    await this._saveBoardState(board);
  }

  /**
   * @returns {Promise<string>}
   */
  async getPurposeStatement() {
    const board = await this._getBoardState();
    return board.purposeStatement || "";
  }

  /**
   * @param {string} statement
   */
  async setPurposeStatement(statement) {
    const board = await this._getBoardState();
    board.purposeStatement = statement;
    await this._saveBoardState(board);
  }

  /**
   * @returns {Promise<string>}
   */
  async getDisplayName() {
    const board = await this._getBoardState();
    return board.displayName || "";
  }

  /**
   * @param {string} name
   */
  async setDisplayName(name) {
    const board = await this._getBoardState();
    board.displayName = name;
    await this._saveBoardState(board);
  }

  /**
   * @returns {Promise<string|null>}
   */
  async getLastBackup() {
    const board = await this._getBoardState();
    return board.lastBackup || null;
  }

  /**
   * @param {string} timestamp
   */
  async setLastBackup(timestamp) {
    const board = await this._getBoardState();
    board.lastBackup = timestamp;
    await this._saveBoardState(board);
  }

  /**
   * @returns {Promise<Array<Object>>}
   */
  async getFavorites() {
    const board = await this._getBoardState();
    return board.favorites || [];
  }

  /**
   * @param {Array<Object>} favorites
   */
  async setFavorites(favorites) {
    const board = await this._getBoardState();
    board.favorites = favorites;
    await this._saveBoardState(board);
  }

  /**
   * @param {Object} favoriteData
   */
  async addFavorite(favoriteData) {
    const board = await this._getBoardState();
    const newFavorite = {
      id: crypto.randomUUID(),
      ...favoriteData
    };
    board.favorites = [...(board.favorites || []), newFavorite];
    await this._saveBoardState(board);
  }

  /**
   * @param {string} id
   */
  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteFavorite(id) {
    const board = await this._getBoardState();
    board.favorites = (board.favorites || []).filter((f) => f.id !== id);
    await this._saveBoardState(board);
  }

  /**
   * Registers a new board with an edit token.
   * @param {string} editToken - The edit token to register.
   * @returns {Promise<string>} The new board ID.
   */
  async register(editToken) {
    const board = await this._getBoardState();
    board.editToken = editToken;
    board.boardId = crypto.randomUUID();
    await this._saveBoardState(board);
    return board.boardId;
  }

  /**
   * Validates an edit token for a given board.
   * @param {string} boardId - The ID of the board.
   * @param {string} editToken - The edit token to validate.
   * @returns {Promise<boolean>}
   */
  async validateEditToken(boardId, editToken) {
    const board = await this._getBoardState();
    return board.boardId === boardId && board.editToken === editToken;
  }
}


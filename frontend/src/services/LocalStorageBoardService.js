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
       lastBackup: null
     };

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
}

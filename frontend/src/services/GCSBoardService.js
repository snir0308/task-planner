import { BoardService } from "./BoardService.js";

/**
 * @class GCSBoardService
 * @extends BoardService
 * @description Implementation of BoardService using Google Cloud Functions.
 */
export class GCSBoardService extends BoardService {
  /**
   * @param {string} apiUrl - The URL of the Google Cloud Function.
   * @param {string} uuid - The UUID of the board.
   * @param {string} token - The authentication token.
   */
  constructor(apiUrl, uuid, token) {
    super();
    this.apiUrl = apiUrl;
    this.uuid = uuid;
    this.token = token;
  }

  /**
   * Fetches the board object from the API.
   * @private
   * @returns {Promise<Object>} The board object.
   */
  async _fetchBoard() {
    const response = await fetch(`${this.apiUrl}?uuid=${this.uuid}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch board: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Saves the board object to the API.
   * @private
   * @param {Object} board - The board object to save.
   * @returns {Promise<void>}
   */
  async _saveBoard(board) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        board: board,
        fileName: `boards/${this.uuid}.json`
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to save board: ${response.statusText}`);
    }
  }

  /**
   * @returns {Promise<Array<Object>>}
   */
  async getTasks() {
    const board = await this._fetchBoard();
    return board.tasks || [];
  }

  /**
   * @param {Array<Object>} tasks
   */
  async setTasks(tasks) {
    const board = await this._fetchBoard();
    board.tasks = tasks;
    await this._saveBoard(board);
  }

  /**
   * @returns {Promise<string>}
   */
  async getProfileImage() {
    const board = await this._fetchBoard();
    return board.profileImage || "";
  }

  /**
   * @param {string} url
   */
  async setProfileImage(url) {
    const board = await this._fetchBoard();
    board.profileImage = url;
    await this._saveBoard(board);
  }

  /**
   * @returns {Promise<string>}
   */
  async getPurposeStatement() {
    const board = await this._fetchBoard();
    return board.purposeStatement || "";
  }

  /**
   * @param {string} statement
   */
  async setPurposeStatement(statement) {
    const board = await this._fetchBoard();
    board.purposeStatement = statement;
    await this._saveBoard(board);
  }

  /**
   * @returns {Promise<string|null>}
   */
  async getLastBackup() {
    const board = await this._fetchBoard();
    return board.lastBackup || null;
  }

  /**
   * @param {string} timestamp
   */
  async setLastBackup(timestamp) {
    const board = await this._fetchBoard();
    board.lastBackup = timestamp;
    await this._saveBoard(board);
  }
}

import { BoardService } from "./BoardService.js";

/**
 * @class LocalStorageBoardService
 * @extends BoardService
 * @description Implementation of BoardService using localStorage.
 */
export class LocalStorageBoardService extends BoardService {
  /**
   * @returns {Promise<Array<Object>>}
   */
  async getTasks() {
    const stored = localStorage.getItem("matrix-tasks");
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * @param {Array<Object>} tasks
   */
  async setTasks(tasks) {
    localStorage.setItem("matrix-tasks", JSON.stringify(tasks));
  }

  /**
   * @returns {Promise<string>}
   */
  async getProfileImage() {
    return localStorage.getItem("matrix-profile-image") || "";
  }

  /**
   * @param {string} url
   */
  async setProfileImage(url) {
    localStorage.setItem("matrix-profile-image", url);
  }

  /**
   * @returns {Promise<string>}
   */
  async getPurposeStatement() {
    return localStorage.getItem("matrix-purpose-statement") || "";
  }

  /**
   * @param {string} statement
   */
  async setPurposeStatement(statement) {
    localStorage.setItem("matrix-purpose-statement", statement);
  }

  /**
   * @returns {Promise<string|null>}
   */
  async getLastBackup() {
    return localStorage.getItem("matrix-last-backup");
  }

  /**
   * @param {string} timestamp
   */
  async setLastBackup(timestamp) {
    localStorage.setItem("matrix-last-backup", timestamp);
  }
}

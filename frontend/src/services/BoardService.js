/**
 * @typedef {import('../types.js').Task} Task
 *
 * @interface BoardService
 * @description Defines the interface for managing board data.
 */
export class BoardService {
  /**
   * Retrieves the list of tasks.
   * @returns {Promise<Task[]>} A promise that resolves to the list of tasks.
   */
  async getTasks() {
    throw new Error("Method 'getTasks()' must be implemented.");
  }

  /**
   * Updates the list of tasks.
   * @param {Task[]} tasks - The new list of tasks.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async setTasks(tasks) {
    throw new Error("Method 'setTasks()' must be implemented.");
  }

  /**
   * Retrieves the user's profile image URL.
   * @returns {Promise<string>} A promise that resolves to the profile image URL.
   */
  async getProfileImage() {
    throw new Error("Method 'getProfileImage()' must be implemented.");
  }

  /**
   * Sets the user's profile image URL.
   * @param {string} url - The new profile image URL.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async setProfileImage(url) {
    throw new Error("Method 'setProfileImage()' must be implemented.");
  }

  /**
   * Retrieves the user's purpose statement.
   * @returns {Promise<string>} A promise that resolves to the purpose statement.
   */
  async getPurposeStatement() {
    throw new Error("Method 'getPurposeStatement()' must be implemented.");
  }

  /**
   * Sets the user's purpose statement.
   * @param {string} statement - The new purpose statement.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async setPurposeStatement(statement) {
    throw new Error("Method 'setPurposeStatement()' must be implemented.");
  }

  /**
   * Retrieves the timestamp of the last backup.
   * @returns {Promise<string|null>} A promise that resolves to the last backup timestamp.
   */
  async getLastBackup() {
    throw new Error("Method 'getLastBackup()' must be implemented.");
  }

  /**
   * Sets the timestamp of the last backup.
   * @param {string} timestamp - The new last backup timestamp.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async setLastBackup(timestamp) {
    throw new Error("Method 'setLastBackup()' must be implemented.");
  }

  /**
   * Retrieves the user's display name.
   * @returns {Promise<string>} A promise that resolves to the display name.
   */
  async getDisplayName() {
    throw new Error("Method 'getDisplayName()' must be implemented.");
  }

  /**
   * Sets the user's display name.
   * @param {string} name - The new display name.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async setDisplayName(name) {
    throw new Error("Method 'setDisplayName()' must be implemented.");
  }
}

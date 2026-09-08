/**
 * @interface Storage
 */
class Storage {
  /**
   * Get data from storage.
   * @param {string} key - The key to retrieve data for.
   * @returns {Promise<string|null>} The data as a string, or null if not found.
   */
  async get(key) {
    throw new Error('Method "get(key)" must be implemented.');
  }

  /**
   * Set data in storage.
   * @param {string} key - The key to store data under.
   * @param {string} data - The data to store.
   * @returns {Promise<void>}
   */
  async set(key, data) {
    throw new Error('Method "set(key, data)" must be implemented.');
  }

  /**
   * Delete data from storage.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   */
  async delete(key) {
    throw new Error('Method "delete(key)" must be implemented.');
  }
}

module.exports = Storage;

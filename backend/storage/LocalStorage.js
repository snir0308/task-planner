const fs = require('fs/promises');
const path = require('path');
const Storage = require('./Storage');
const { NotFoundError } = require('../errors/AppError');

class LocalStorage extends Storage {
  /**
   * @param {string} baseDir - The directory where files will be stored.
   */
  constructor(baseDir) {
    super();
    this.baseDir = baseDir;
  }

  /**
   * Helper to resolve the full path.
   * @param {string} key 
   * @returns {string}
   */
  _getFilePath(key) {
    return path.join(this.baseDir, `${key}.json`);
  }

  /**
   * @param {string} key 
   * @returns {Promise<string|null>}
   */
  async get(key) {
    const filePath = this._getFilePath(key);
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * @param {string} key 
   * @param {string} data 
   * @returns {Promise<void>}
   */
  async set(key, data) {
    const filePath = this._getFilePath(key);
    await fs.writeFile(filePath, data, 'utf8');
  }

  /**
   * @param {string} key 
   * @returns {Promise<void>}
   */
  async delete(key) {
    const filePath = this._getFilePath(key);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

module.exports = LocalStorage;

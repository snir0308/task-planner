const BackendService = require('./BackendService');
const { NotFoundError, BadRequestError } = require('../errors/AppError');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class BackendServiceImpl extends BackendService {
  /**
   * @param {import('../storage/Storage').default} storage - The storage implementation.
   */
  constructor(storage) {
    super();
    this.storage = storage;
  }

  /**
   * @param {string} boardId 
   * @returns {Promise<object|null>}
   */
  async getBoard(boardId) {
    const data = await this.storage.get(boardId);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new BadRequestError('Invalid board data format');
    }
  }

  /**
   * @param {string} boardId 
   * @param {object} board 
   * @returns {Promise<void>}
   */
  async saveBoard(boardId, board) {
    const data = JSON.stringify(board);
    await this.storage.set(boardId, data);
  }

  /**
   * @param {string} boardId 
   * @param {string} editToken 
   * @returns {Promise<boolean>}
   */
  async validateEditToken(boardId, editToken) {
    const board = await this.getBoard(boardId);
    if (!board) {
      return false;
    }
    if (!board.encryptedEditToken) {
      return false;
    }
    try {
      return await bcrypt.compare(editToken, board.encryptedEditToken);
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {string} editToken 
   * @returns {Promise<string>}
   */
  async handleRegistration(editToken) {
    const boardId = crypto.randomUUID();
    const saltRounds = 10;
    const encryptedEditToken = await bcrypt.hash(editToken, saltRounds);

    const board = {
      id: boardId,
      encryptedEditToken,
      createdAt: new Date().toISOString(),
    };

    await this.saveBoard(boardId, board);
    return boardId;
  }
}

module.exports = BackendServiceImpl;

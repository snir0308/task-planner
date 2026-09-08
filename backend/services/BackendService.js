/**
 * @interface BackendService
 */
class BackendService {
  /**
   * Get a board by its ID.
   * @param {string} boardId - The ID of the board to retrieve.
   * @returns {Promise<object|null>} The board object, or null if not found.
   */
  async getBoard(boardId) {
    throw new Error('Method "getBoard(boardId)" must be implemented.');
  }

  /**
   * Save a board.
   * @param {string} boardId - The ID of the board to save.
   * @param {object} board - The board data.
   * @returns {Promise<void>}
   */
  async saveBoard(boardId, board) {
    throw new Error('Method "saveBoard(boardId, board)" must be implemented.');
  }

  /**
   * Validate an edit token for a board.
   * @param {string} boardId - The ID of the board.
   * @param {string} editToken - The token to validate.
   * @returns {Promise<boolean>} True if valid, false otherwise.
   */
  async validateEditToken(boardId, editToken) {
    throw new Error('Method "validateEditToken(boardId, editToken)" must be implemented.');
  }

  /**
   * Handle user registration.
   * Generates a boardId, encrypts the editToken, and saves the initial board.
   * @param {string} editToken - The token provided during registration.
   * @returns {Promise<string>} The newly created boardId.
   */
  async handleRegistration(editToken) {
    throw new Error('Method "handleRegistration(editToken)" must be implemented.');
  }
}

module.exports = BackendService;

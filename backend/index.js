const functions = require('@google-cloud/functions-framework');
const LocalStorage = require('./storage/LocalStorage');
const BackendServiceImpl = require('./services/BackendServiceImpl');
const { 
  AppError, 
  NotFoundError, 
  BadRequestError, 
  UnauthorizedError, 
  InternalServerError 
} = require('./errors/AppError');
const path = require('path');

// Initialization
console.log('__dirname:', __dirname);
const storageDir = path.join(__dirname, 'storage/local_files');
console.log('Storage directory:', storageDir);
const storage = new LocalStorage(storageDir);
const backendService = new BackendServiceImpl(storage);

/**
 * Error mapping function
 * @param {Error} error 
 * @returns {object} { statusCode, message }
 */
function mapError(error) {
  if (error instanceof AppError) {
    return { statusCode: error.statusCode, message: error.message };
  }
  console.error('Unhandled Error:', error);
  return { statusCode: 500, message: 'Internal Server Error' };
}

/**
 * Main GCF Entry Point
 */
functions.http('api', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  const { method, url, body } = req;

  try {
    // Simple Router
    
    // POST /register
    if (method === 'POST' && url.includes('/register')) {
      if (!body || !body.editToken) {
        throw new BadRequestError('editToken is required');
      }
      const boardId = await backendService.handleRegistration(body.editToken);
      return res.status(201).json({ boardId });
    }

    // GET /board/:boardId
    const boardMatch = url.match(/\/board\/([^/]+)/);
    if (method === 'GET' && boardMatch) {
      const boardId = boardMatch[1];
      const board = await backendService.getBoard(boardId);
      if (!board) {
        throw new NotFoundError('Board not found');
      }
      return res.status(200).json(board);
    }

    // PUT /board/:boardId
    if (method === 'PUT' && boardMatch) {
      const boardId = boardMatch[1];
      if (!body || !body.board) {
        throw new BadRequestError('Board data is required');
      }
      await backendService.saveBoard(boardId, body.board);
      return res.status(204).send();
    }

    // POST /validate
    if (method === 'POST' && url.includes('/validate')) {
      const { boardId, editToken } = body || {};

      if (!boardId || !editToken) {
        throw new BadRequestError('boardId and editToken are required in the request body');
      }

      const isValid = await backendService.validateEditToken(boardId, editToken);
      return res.status(200).json({ isValid });
    }

    // Default 404
    throw new NotFoundError('Route not found');

  } catch (error) {
    const { statusCode, message } = mapError(error);
    res.status(statusCode).json({ error: message });
  }
});
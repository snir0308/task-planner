const { Storage } = require('@google-cloud/storage');
const bcrypt = require('bcrypt');

const storage = new Storage();
const BUCKET_NAME = process.env.BOARD_BUCKET_NAME || 'my-board-storage-bucket';

/**
 * Verifies the provided token against the hash stored in the environment.
 * @param {string} token The token to verify.
 * @returns {Promise<boolean>} True if the token is valid, false otherwise.
 */
const verifyToken = async (token) => {
  const hash = process.env.TOKEN_HASH;
  if (!hash || !token) {
    return false;
  }
  try {
    return await bcrypt.compare(token, hash);
  } catch (error) {
    console.error('Error during bcrypt comparison:', error);
    return false;
  }
};

/**
 * HTTP Cloud Function to persist board JSON to GCS.
 * Handles full document replacement pattern.
 * 
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.persistBoard = async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST, GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  const token = req.headers.authorization || '';
  
  if (!(await verifyToken(token))) {
    return res.status(401).send({ error: 'Unauthorized: Invalid or missing token.' });
  }

  // Handle GET request: Fetch board by UUID
  // Expects query parameter: ?uuid=[uuid]
  if (req.method === 'GET') {
    const uuid = req.query.uuid;
    if (!uuid) {
      return res.status(400).send({ error: 'Missing uuid query parameter.' });
    }

    try {
      const bucket = storage.bucket(BUCKET_NAME);
      const fileName = `boards/${uuid}.json`;
      const file = bucket.file(fileName);

      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).send({ error: 'Board not found.' });
      }

      const [content] = await file.download();
      const board = JSON.parse(content.toString());

      res.status(200).send(board);
    } catch (error) {
      console.error('Error fetching board from GCS:', error);
      res.status(500).send({ error: 'Internal Server Error: Failed to fetch board.' });
    }
    return;
  }

  // Handle POST request: Save board
  if (req.method === 'POST') {
    const { board, fileName } = req.body;

    if (!board) {
      return res.status(400).send({ error: 'Missing board object in request body.' });
    }

    if (!fileName) {
      return res.status(400).send({ error: 'Missing fileName in request body.' });
    }

    try {
      const bucket = storage.bucket(BUCKET_NAME);
      const file = bucket.file(fileName);

      // Full document replacement pattern: overwrite the file with the new JSON content
      await file.save(JSON.stringify(board, null, 2), {
        contentType: 'application/json',
        resumable: false
      });

      console.log(`Successfully saved board to ${fileName} in bucket ${BUCKET_NAME}`);
      res.status(200).send({ message: 'Board persisted successfully.' });
    } catch (error) {
      console.error('Error saving board to GCS:', error);
      res.status(500).send({ error: 'Internal Server Error: Failed to save board.' });
    }
    return;
  }

  res.status(405).send({ error: 'Method Not Allowed' });
};

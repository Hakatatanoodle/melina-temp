'use strict';

/**
 * Consistent response + error handling for the whole API.
 *
 * Every success looks like:      { success: true, data: ... }
 * Every failure looks like:      { success: false, message: "...", errors?: { field: msg } }
 */

const { HttpError } = require('../utils/http-error');

function sendSuccess(res, status, data) {
  res.status(status).json({ success: true, data });
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Not found.' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    const body = { success: false, message: err.message };
    if (err.errors) body.errors = err.errors;
    return res.status(err.status).json(body);
  }

  if (err && err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, message: 'Photo must be 5 MB or smaller.' });
    }
    return res.status(400).json({ success: false, message: 'Could not process that upload.' });
  }

  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'The request body is not valid JSON.' });
  }

  // eslint-disable-next-line no-console
  console.error('[PetCare] Unhandled error:', err);
  return res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
}

module.exports = { sendSuccess, notFoundHandler, errorHandler };

'use strict';

/**
 * HttpError — an error that carries an HTTP status and an optional
 * field-level `errors` map. Thrown by services; converted to a consistent
 * JSON response by the global error middleware.
 */
class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Wraps an async route/controller so thrown or rejected errors reach the
 * global error handler instead of crashing the request.
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { HttpError, asyncHandler };

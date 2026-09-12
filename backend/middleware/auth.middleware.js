'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');
const { findUserById } = require('../storage/json-storage');
const { HttpError } = require('../utils/http-error');

/**
 * Authentication middleware.
 *
 * Identity comes from the HttpOnly auth cookie the browser attaches
 * automatically. The token is verified and the user re-loaded from storage so
 * a token for a deleted account is rejected. Business/ownership rules live in
 * services — this layer only answers "who are you?".
 */
function requireAuth(req, res, next) {
  const token = req.cookies ? req.cookies[config.cookieName] : undefined;

  if (!token) {
    return next(new HttpError(401, 'You need to log in to do that.'));
  }

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch {
    return next(new HttpError(401, 'Your session has expired. Please log in again.'));
  }

  const user = findUserById(payload.sub);
  if (!user) {
    return next(new HttpError(401, 'Your session has expired. Please log in again.'));
  }

  req.user = { id: user.id, fullName: user.fullName, email: user.email, createdAt: user.createdAt };
  return next();
}

module.exports = { requireAuth };

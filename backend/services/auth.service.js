'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const storage = require('../storage');
const { HttpError } = require('../utils/http-error');
const { isBlank, isEmail, normalizeInput } = require('../utils/validation');

const PASSWORD_MIN_LENGTH = 8;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function publicUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function signSession(userId) {
  const expiresIn = config.jwtExpiresIn;
  const token = jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn });
  return token;
}

function validateRegistration(input, errors) {
  if (isBlank(input.fullName)) errors.fullName = 'Please enter your name.';
  else if (input.fullName.length > 80) errors.fullName = 'Name must be 80 characters or fewer.';

  if (isBlank(input.email)) errors.email = 'Please enter your email.';
  else if (!isEmail(input.email)) errors.email = 'Please enter a valid email address.';
  else if (input.email.length > 120) errors.email = 'Email is too long.';

  if (isBlank(input.password)) errors.password = 'Please choose a password.';
  else if (input.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (input.confirmPassword !== undefined && input.password !== input.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
}

/* ------------------------------------------------------------------ */
/* Business logic                                                      */
/* ------------------------------------------------------------------ */

async function register(input) {
  const data = normalizeInput(input);
  const errors = {};
  validateRegistration(data, errors);

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Please fix the highlighted fields.', errors);
  }

  const email = data.email.toLowerCase();
  if (await storage.findUserByEmail(email)) {
    throw new HttpError(409, 'An account with this email already exists. Try logging in instead.', {
      email: 'This email is already registered.',
    });
  }

  const passwordHash = bcrypt.hashSync(data.password, 10);
  let user;
  try {
    user = await storage.addUser({
      fullName: data.fullName,
      email,
      passwordHash,
    });
  } catch (err) {
    // Atomic duplicate guard from the Mongo unique index (two requests racing
    // past the check above still collapse to one 409, never two accounts).
    if (err && err.code === storage.EMAIL_TAKEN) {
      throw new HttpError(409, 'An account with this email already exists. Try logging in instead.', {
        email: 'This email is already registered.',
      });
    }
    throw err;
  }

  return { user: publicUser(user), token: signSession(user.id) };
}

async function login(input) {
  const data = normalizeInput(input);
  const errors = {};
  if (isBlank(data.email)) errors.email = 'Please enter your email.';
  else if (!isEmail(data.email)) errors.email = 'Please enter a valid email.';
  if (isBlank(data.password)) errors.password = 'Please enter your password.';

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Please fix the highlighted fields.', errors);
  }

  const user = await storage.findUserByEmail(data.email);
  // Same message for unknown email and wrong password — do not leak
  // which accounts exist.
  if (!user || !bcrypt.compareSync(data.password, user.passwordHash)) {
    throw new HttpError(401, 'Invalid email or password.');
  }

  return { user: publicUser(user), token: signSession(user.id) };
}

module.exports = {
  register,
  login,
  publicUser,
  PASSWORD_MIN_LENGTH,
};

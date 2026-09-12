'use strict';

const config = require('../config');
const authService = require('../services/auth.service');
const { sendSuccess } = require('../middleware/error.middleware');
const { asyncHandler } = require('../utils/http-error');

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.isProduction,
  path: '/',
  maxAge: config.cookieMaxAgeMs,
};

function setAuthCookie(res, token) {
  res.cookie(config.cookieName, token, COOKIE_OPTIONS);
}

function clearAuthCookie(res) {
  res.clearCookie(config.cookieName, { ...COOKIE_OPTIONS, maxAge: undefined });
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { user, token } = authService.register(req.body || {});
  setAuthCookie(res, token);
  sendSuccess(res, 201, { user });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { user, token } = authService.login(req.body || {});
  setAuthCookie(res, token);
  sendSuccess(res, 200, { user });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  sendSuccess(res, 200, { loggedOut: true });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, { user: req.user });
});

module.exports = { register, login, logout, me };

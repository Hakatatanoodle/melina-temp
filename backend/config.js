'use strict';

/**
 * Central runtime configuration.
 *
 * Secrets and ports live in `.env` (see .env.example) so the application is
 * never hard-coding sensitive values. A development-only fallback secret is
 * provided so the app still runs in a classroom machine without setup —
 * the warning printed on boot makes the situation explicit.
 */

require('dotenv').config();

const HOUR_IN_MS = 60 * 60 * 1000;

const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: 'petcare_token',
  cookieMaxAgeMs: 7 * 24 * 60 * 60 * 1000, // keep in sync with jwtExpiresIn default
  isProduction: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',
};

if (!config.jwtSecret) {
  config.jwtSecret = 'petcare-development-secret-do-not-use-in-production';
  // eslint-disable-next-line no-console
  console.warn(
    '[PetCare] JWT_SECRET is not set in .env — using an insecure development fallback. ' +
      'Copy backend/.env.example to backend/.env and set a real secret.'
  );
}

module.exports = config;
module.exports.HOUR_IN_MS = HOUR_IN_MS;

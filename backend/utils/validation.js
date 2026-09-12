'use strict';

/**
 * Shared validation helpers.
 *
 * Services call `collectErrors` to build a `{ field: message }` map; the map
 * (when non-empty) is raised as a 400 with field-level messages the frontend
 * can render next to the offending inputs.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isEmail(value) {
  return typeof value === 'string' && EMAIL_PATTERN.test(value.trim());
}

function isBlank(value) {
  return typeof value !== 'string' || value.trim() === '';
}

function isDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isNonNegativeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/**
 * Trims every string field of a payload in place (undefined values preserved).
 */
function normalizeInput(input) {
  const out = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') out[key] = value.trim();
    else out[key] = value;
  }
  return out;
}

module.exports = { isEmail, isBlank, isDateOnly, isNonNegativeNumber, normalizeInput };

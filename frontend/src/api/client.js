/**
 * Thin API client.
 *
 * All backend communication lives here and in the service modules that use it.
 * The HttpOnly auth cookie is attached automatically by the browser
 * (`credentials: 'same-origin'` + the Vite dev proxy), so no token handling
 * exists on the client.
 */

const BASE = '/api';

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors || null;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Cannot reach the PetCare service. Please check your connection.', 0);
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok || !payload || payload.success === false) {
    throw new ApiError(
      payload?.message || 'Something went wrong. Please try again.',
      res.status,
      payload?.errors
    );
  }

  return payload.data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

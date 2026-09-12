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

async function request(path, { method = 'GET', body, form } = {}) {
  const hasBody = body !== undefined || form !== undefined;
  const headers = {};
  if (hasBody && !form) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'same-origin',
      headers,
      // For FormData we omit the Content-Type header so the browser sets the
      // multipart boundary itself.
      body: form || (body === undefined ? undefined : JSON.stringify(body)),
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
  /** Multipart file upload; returns { path } pointing at the stored image. */
  upload: (formData) => request('/uploads', { method: 'POST', form: formData }),
};

import { api } from '../api/client.js';

/** Authentication service — the only module the UI uses for auth. */
export const authService = {
  register: ({ fullName, email, password, confirmPassword }) =>
    api.post('/auth/register', { fullName, email, password, confirmPassword }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

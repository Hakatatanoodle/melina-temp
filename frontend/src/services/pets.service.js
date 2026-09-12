import { api } from '../api/client.js';

/** Pet CRUD service. */
export const petsService = {
  list: () => api.get('/pets'),
  get: (petId) => api.get(`/pets/${petId}`),
  create: (pet) => api.post('/pets', pet),
  update: (petId, pet) => api.put(`/pets/${petId}`, pet),
  remove: (petId) => api.delete(`/pets/${petId}`),
};

import { api } from '../api/client.js';

/** Health-record CRUD service. */
export const healthService = {
  listForPet: (petId) => api.get(`/pets/${petId}/health-records`),
  listAll: () => api.get('/health-records'),
  createForPet: (petId, record) => api.post(`/pets/${petId}/health-records`, record),
  update: (recordId, record) => api.put(`/health-records/${recordId}`, record),
  remove: (recordId) => api.delete(`/health-records/${recordId}`),
};

export const RECORD_TYPES = [
  { value: 'vaccination', label: 'Vaccination' },
  { value: 'checkup', label: 'General checkup' },
  { value: 'medication', label: 'Medication' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'other', label: 'Other health note' },
];

export const recordTypeLabel = (value) =>
  RECORD_TYPES.find((type) => type.value === value)?.label || 'Health note';

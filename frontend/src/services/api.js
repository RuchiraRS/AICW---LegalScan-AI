import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => localStorage.removeItem('token'),
  setToken: (token) => localStorage.setItem('token', token)
};

export const inspectionsAPI = {
  getAll: (params) => api.get('/inspections', { params }),
  getById: (id) => api.get(`/inspections/${id}`),
  create: (data) => api.post('/inspections', data),
  uploadImages: (id, formData) => api.post(`/inspections/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  analyze: (id) => api.post(`/inspections/${id}/analyze`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

export const violationsAPI = {
  getAll: (params) => api.get('/violations', { params }),
  review: (id, reviewData) => api.put(`/violations/${id}/review`, reviewData),
};

export const reportsAPI = {
  generate: (inspectionId) => api.post(`/reports/${inspectionId}/generate`),
};

export default api;

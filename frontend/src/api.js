import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Projects endpoints
export const projectsAPI = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (projectId, data) => api.post(`/projects/${projectId}/members`, data),
  removeMember: (projectId, memberId) => api.delete(`/projects/${projectId}/members/${memberId}`)
};

// Tasks endpoints
export const tasksAPI = {
  create: (data) => api.post('/tasks', data),
  getByProject: (projectId, params) => api.get(`/tasks/project/${projectId}`, { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`)
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAssignedToMe: () => api.get('/dashboard/assigned-to-me'),
  getOverdue: () => api.get('/dashboard/overdue'),
  getSummary: (projectId) => api.get(`/dashboard/summary/${projectId}`)
};

export default api;

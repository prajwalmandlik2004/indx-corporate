import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data: { email: string; username: string; full_name: string; password: string }) =>
    api.post('/api/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data: { full_name: string }) =>
    api.put('/api/user/profile', data),
};

// Test APIs
export const testAPI = {
  getCategories: () => api.get('/api/test/categories'),
  startTest: (data: { category: string; level: string }) =>
    api.post('/api/test/start', data),
  submitTest: (data: { test_id: number; answers: Array<{ question_id: number; answer_text: string }> }) =>
    api.post('/api/test/submit', data),
  getDashboard: () => api.get('/api/test/dashboard'),
};

// Result APIs
export const resultAPI = {
  getResult: (testId: number) => api.get(`/api/result/${testId}`),
};

export default api;
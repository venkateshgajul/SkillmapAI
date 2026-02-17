import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sgm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const resumeApi = {
  upload: (file) => {
    const form = new FormData();
    form.append('resume', file);
    return api.post('/resume/upload-resume', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: () => api.get('/resume'),
};

export const analysisApi = {
  getJobs: () => api.get('/analysis/jobs'),
  analyze: (data) => api.post('/analysis/analyze-job', data),
  getHistory: () => api.get('/analysis/history'),
  getProgress: () => api.get('/analysis/progress'),
};

export const profileApi = {
  get: () => api.get('/profile'),
  completeCourse: (course) => api.post('/profile/course/complete', { course }),
  removeCourse: (course) => api.post('/profile/course/remove', { course }),
};

export default api;

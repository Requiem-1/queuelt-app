import axios from 'axios';
import { toast } from 'react-hot-toast';

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');

if (!rawBaseUrl.includes('/api/v1')) {
  if (rawBaseUrl.endsWith('/api')) {
    rawBaseUrl = `${rawBaseUrl}/v1`;
  } else {
    rawBaseUrl = `${rawBaseUrl}/api/v1`;
  }
}

const API_BASE_URL = rawBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('queueit_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Basic error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || 'An unexpected API error occurred';

    if (!error.response || status >= 500) {
      toast.error('Network error or server unavailable');
    }

    return Promise.reject(new Error(message));
  }
);

export default api;

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  },
);

// axios for form data
export const axiosFormData = axios.create({
  baseURL: import.meta.env.VITE_UPLOAD_API_BASE_URL as string,
  timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

axiosFormData.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axiosFormData.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error.message),
);

export default axiosInstance;

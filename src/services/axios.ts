import axios from 'axios';
import { store } from '@/store';
import { showToast } from '@/store/toastSlice';
import errorMessages from '@/utils/errorMessages';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error?.response?.data as
      | {
          detail?: string;
          code?: number;
        }
      | undefined;

    if (data) {
      const message =
        (data.code && errorMessages[data.code]) ||
        data.detail ||
        'Ocurrió un error';

      if (typeof window !== 'undefined') {
        store.dispatch(showToast({ message, color: 'red' }));
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

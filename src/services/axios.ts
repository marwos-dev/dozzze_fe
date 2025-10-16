import axios from 'axios';
import errorMessages from '@/utils/errorMessages';
import { clearReserveStorage } from '@/utils/storage';
import { getAccessToken, clearPersistedSession } from '@/utils/authSession';
import { clearCustomer } from '@/store/customerSlice';
import { getStoreDispatch } from '@/store/storeAccessors';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: false,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearPersistedSession();
      const dispatch = getStoreDispatch();
      if (dispatch) {
        dispatch(clearCustomer());
        clearReserveStorage(dispatch);
      }
    }

    const data = error?.response?.data as
      | {
          detail?: string;
          code?: number;
        }
      | undefined;

    if (data) {
      error.message =
        (data.code && errorMessages[data.code]) ||
        data.detail ||
        'Ocurrió un error';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

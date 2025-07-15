import Cookies from 'js-cookie';
import axios from '@/services/axios';
import { clearCustomer } from '@/store/customerSlice';
import { AppDispatch } from '@/store';

export const initAxiosAuthHeader = () => {
  const token = Cookies.get('accessToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const logoutCustomer = (dispatch: AppDispatch) => {
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('customerProfile', { path: '/' });
  delete axios.defaults.headers.common['Authorization'];
  dispatch(clearCustomer());
};

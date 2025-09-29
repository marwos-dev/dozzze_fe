import { clearCustomer } from '@/store/customerSlice';
import type { AppDispatch } from '@/store';
import { clearReserveStorage } from '@/utils/storage';
import { clearPersistedSession } from './authSession';

export const logoutCustomer = (dispatch: AppDispatch) => {
  clearPersistedSession();
  dispatch(clearCustomer());
  clearReserveStorage(dispatch);
};

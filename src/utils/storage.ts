import { persistor, AppDispatch } from '@/store';
import { clearReservations } from '@/store/reserveSlice';

/**
 * Clears reservation-related data from the Redux store and session storage.
 */
export const clearReserveStorage = (dispatch: AppDispatch) => {
  dispatch(clearReservations());
  void persistor.purge();
};

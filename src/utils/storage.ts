import type { AppDispatch } from '@/store';
import { clearReservations } from '@/store/reserveSlice';
import { getStorePersistor } from '@/store/storeAccessors';

/**
 * Clears reservation-related data from the Redux store and session storage.
 */
export const clearReserveStorage = (dispatch: AppDispatch) => {
  dispatch(clearReservations());
  const persistor = getStorePersistor();
  if (persistor) {
    void persistor.purge();
  }
};

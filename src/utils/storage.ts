import { clearReservations } from '@/store/reserveSlice';
import type { Dispatch, AnyAction } from '@reduxjs/toolkit';
import type { Persistor } from 'redux-persist';

let persistorRef: Persistor | null = null;

export const registerReservePersistor = (persistor: Persistor) => {
  persistorRef = persistor;
};

/**
 * Clears reservation-related data from the Redux store and session storage.
 */
export const clearReserveStorage = (dispatch: Dispatch<AnyAction>) => {
  dispatch(clearReservations());
  if (persistorRef) {
    void persistorRef.purge();
  }
};

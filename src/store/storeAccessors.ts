import type { Persistor } from 'redux-persist';
import type { AppDispatch } from './index';

let dispatchRef: AppDispatch | null = null;
let persistorRef: Persistor | null = null;

export const setStoreRefs = (
  dispatch: AppDispatch,
  persistor: Persistor
): void => {
  dispatchRef = dispatch;
  persistorRef = persistor;
};

export const getStoreDispatch = (): AppDispatch | null => dispatchRef;

export const getStorePersistor = (): Persistor | null => persistorRef;

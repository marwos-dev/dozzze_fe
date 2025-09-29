import type { WebStorage } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createPersistStorage = (): WebStorage => {
  if (typeof window === 'undefined') {
    const noopStorage: WebStorage = {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };

    return noopStorage;
  }

  return createWebStorage('session');
};

export const persistStorage = createPersistStorage();

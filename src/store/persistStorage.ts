import type { WebStorage } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createPersistStorage = (): WebStorage => {
  if (typeof window === 'undefined') {
    const noopStorage: WebStorage = {
      getItem: () => Promise.resolve(null),
      setItem: (_key, value) => Promise.resolve(value),
      removeItem: () => Promise.resolve(),
    };

    return noopStorage;
  }

  return createWebStorage('session');
};

export const persistStorage = createPersistStorage();

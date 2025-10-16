import { configureStore, combineReducers } from '@reduxjs/toolkit';
import zoneReducer from './zoneSlice';
import propertiesReducer from './propertiesSlice';
import roomsReducer from './roomsSlice';
import reserveReducer from './reserveSlice';
import toastReducer from './toastSlice';
import customerReducer from './customerSlice';
import { persistReducer, persistStore } from 'redux-persist';
import { persistStorage } from './persistStorage';
import { setStoreRefs } from './storeAccessors';

const persistConfig = {
  key: 'root',
  storage: persistStorage,
  whitelist: ['reserve'],
};

const rootReducer = combineReducers({
  zones: zoneReducer,
  properties: propertiesReducer,
  rooms: roomsReducer,
  reserve: reserveReducer,
  toast: toastReducer,
  customer: customerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
setStoreRefs(store.dispatch, persistor);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

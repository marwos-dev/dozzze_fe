import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // usa localStorage

// Tus reducers
import zoneReducer from './zoneSlice';
import propertiesReducer from './propertiesSlice';
import roomsReducer from './roomsSlice';

// Agrupamos los reducers
const rootReducer = combineReducers({
  zones: zoneReducer,
  properties: propertiesReducer,
  rooms: roomsReducer,
});

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['zones', 'properties', 'rooms'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configurado con persistencia
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Necesario para evitar errores con redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor (lo vas a usar en la app)
export const persistor = persistStore(store);

// Tipos
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

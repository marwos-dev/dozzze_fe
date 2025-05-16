import { configureStore } from '@reduxjs/toolkit';
import zoneReducer from './zoneSlice';

export const store = configureStore({
  reducer: {
    zones: zoneReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore, combineReducers } from '@reduxjs/toolkit';

import zoneReducer from './zoneSlice';
import propertiesReducer from './propertiesSlice';
import roomsReducer from './roomsSlice';

const rootReducer = combineReducers({
  zones: zoneReducer,
  properties: propertiesReducer,
  rooms: roomsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

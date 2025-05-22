import { configureStore } from "@reduxjs/toolkit";
import zoneReducer from "./zoneSlice";
import propertiesReducer from "./propertiesSlice";
import roomsReducer from "./roomsSlice";

export const store = configureStore({
  reducer: {
    zones: zoneReducer,
    properties: propertiesReducer,
    rooms: roomsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

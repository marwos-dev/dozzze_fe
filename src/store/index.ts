import { configureStore } from "@reduxjs/toolkit";
import zoneReducer from "./zoneSlice";
import propertiesReducer from "./propertiesSlice";

export const store = configureStore({
  reducer: {
    zones: zoneReducer,
    properties: propertiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import curugReducer from "./slices/curugSlice";

export const store = configureStore({
  reducer: {
    curug: curugReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

"use client";

import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "@/redux_store/slices/global-slices";


export const store = configureStore({
  reducer: globalReducer,
});

export type AppDispatch = typeof store.dispatch;

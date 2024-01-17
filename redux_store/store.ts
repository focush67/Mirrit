"use client";

import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "@/redux_store/slices/global-slices";
import { GlobalState } from "@/types/state";
import { useSelector } from "react-redux";

export const store = configureStore({
  reducer: globalReducer,
});

export type AppDispatch = typeof store.dispatch;

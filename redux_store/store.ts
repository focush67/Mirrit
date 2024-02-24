"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
  PURGE,
  FLUSH,
  PAUSE,
  PERSIST,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import postsReducer from "./slices/posts/post-slice";
import usersReducer from "./slices/users/user-slice";
import savedReducer from "./slices/saved/saved-slice";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["users"],
};

const globalReducer = combineReducers({
  posts: postsReducer,
  users: usersReducer,
  saved: savedReducer,
});

export type StateType = ReturnType<typeof globalReducer>;

const persistedReducer = persistReducer(persistConfig, globalReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, REGISTER, PERSIST, PURGE],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

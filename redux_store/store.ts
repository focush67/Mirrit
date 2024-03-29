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
  version: 2,
  storeName: "Social APP with Prisma",
};

const globalReducer = combineReducers({
  posts: postsReducer,
  users: usersReducer,
  saved: savedReducer,
});

const persistedReducer = persistReducer(persistConfig, globalReducer);

export const store = configureStore({
  reducer: globalReducer,
});

// export const persistor = persistStore(store);
export type StateType = ReturnType<typeof globalReducer>;
export type AppDispatch = typeof store.dispatch;

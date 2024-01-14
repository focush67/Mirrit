"use client";

import { configureStore } from "@reduxjs/toolkit";
import postReducer from "@/redux_store/slices/posts-slice";
import usersReducer from "@/redux_store/slices/users-slice";

export const store = configureStore({
  reducer: {
    posts: postReducer,
    users: usersReducer,
  },
});

import { getAllPosts, getPostsForThunks } from "@/server_actions/posts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const posts = await getPostsForThunks();
  return posts;
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("/api/user");

  return response.data.users;
});

export const fetchSaved = createAsyncThunk("saved/fetchSaved", async () => {
  const response = await axios.get("/api/save");
  const savedPosts = response.data.savedPostsIds;
  return savedPosts || [];
});

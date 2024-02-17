import { Post } from "@/types/post";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("/api/posts");
  return response.data.posts;
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("/api/user");
  return response.data.users;
});

export const fetchSaved = createAsyncThunk(
  "saved/fetchSaved",
  async (email: string) => {
    const response = await axios.get(`/api/save/?email=${email}`);
    return { savedPostsIds: response.data.cluster.posts, email: email };
  }
);

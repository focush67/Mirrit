import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getServerSession } from "next-auth";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("/api/posts");
  return response.data.posts;
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get("/api/user");
  return response.data.users;
});

export const fetchCluster = createAsyncThunk(
  "/saved/fetchClusters",
  async () => {
    const session = await getServerSession();
    const response = await axios.get(
      `/api/save/?email=${session?.user?.email}`
    );
    return response.data.cluster;
  }
);

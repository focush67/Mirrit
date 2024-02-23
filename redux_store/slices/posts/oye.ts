import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPosts } from "../async-thunks";
import { StateType } from "@/redux_store/store";
import {
  CommentType,
  LikeType,
  PostType,
  SavedType,
} from "@/types/time-excluded";

interface StatePost {
  id: string;
  owner_Id: string;
  title: string;
  description: string;
  cover: string;
  likes: LikeType[];
  comments: CommentType[];
  saved: SavedType[];
}

interface PostState {
  entities: Record<string, StateType>;
  postStatus: "loading" | "succeeded" | "failed";
}

const initialState: PostState = {
  entities: {},
  postStatus: "loading",
};

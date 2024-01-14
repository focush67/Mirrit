import { Comment } from "@/types/comment";
import { Post } from "@/types/post";
import { GlobalState } from "@/types/state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultValue: GlobalState = {
  posts: [],
  users: [],
};

const initialState: GlobalState = defaultValue;

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state: GlobalState, action: PayloadAction<Post>): GlobalState => {
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    },

    addPostsChunk: (
      state: GlobalState,
      action: PayloadAction<Post[]>
    ): GlobalState => {
      return {
        ...state,
        posts: action.payload,
      };
    },

    likePost: (
      state: GlobalState,
      action: PayloadAction<{ _id: string }>
    ): GlobalState => {
      console.log("Inside liking redux");
      const { _id } = action.payload;

      return {
        ...state,
        posts: state.posts.map((post: Post) =>
          post._id === _id ? { ...post, likes: Number(post.likes) + 1 } : post
        ),
      };
    },

    commentOnPost: (
      state: GlobalState,
      action: PayloadAction<{ _id: string; comment: Comment }>
    ): GlobalState => {
      const { _id, comment } = action.payload;

      return {
        ...state,
        posts: state.posts.map((post: Post) =>
          post._id === _id
            ? { ...post, comments: [...post.comments, comment] }
            : post
        ),
      };
    },

    resetPosts: (): GlobalState => {
      return initialState;
    },
  },
});

export const { addPost, addPostsChunk, likePost, commentOnPost, resetPosts } =
  postSlice.actions;

export default postSlice.reducer;

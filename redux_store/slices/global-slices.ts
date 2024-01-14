import { Comment } from "@/types/comment";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/profile";
import { GlobalState } from "@/types/state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultValue: GlobalState = {
  posts: [],
  users: [],
  saved: [],
  globals: undefined,
};

const initialState: GlobalState = defaultValue;

const globalSlice = createSlice({
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

    addNewSavedPost: (
      state: GlobalState,
      action: PayloadAction<Post>
    ): GlobalState => {
      return {
        ...state,
        saved: [...state.saved, action.payload],
      };
    },

    addAllSavedPosts: (
      state: GlobalState,
      action: PayloadAction<Post[]>
    ): GlobalState => {
      return {
        ...state,
        saved: action.payload,
      };
    },

    removeSavedPost: (
      state: GlobalState,
      action: PayloadAction<{ _id: string }>
    ): GlobalState => {
      return {
        ...state,
        saved: state.saved.filter(
          (saved: Post) => saved._id !== action.payload._id
        ),
      };
    },

    removeAllSavedPosts: (state: GlobalState): GlobalState => {
      return {
        ...state,
        saved: [],
      };
    },

    addNewUser: (
      state: GlobalState,
      action: PayloadAction<UserProfile>
    ): GlobalState => {
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    },

    addAllUsers: (
      state: GlobalState,
      action: PayloadAction<UserProfile[]>
    ): GlobalState => {
      return {
        ...state,
        users: action.payload,
      };
    },

    addRelationship: (
      state: GlobalState,
      action: PayloadAction<{ initiator: string; target: string }>
    ): GlobalState => {
      const updatedUsers = state.users.map((user: UserProfile) =>
        user.email === action.payload.initiator
          ? { ...user, following: [...user.following, action.payload.target] }
          : user
      );

      return {
        ...state,
        users: updatedUsers.map((user: any) =>
          user.email === action.payload.target
            ? {
                ...user,
                followers: [...user.followers, action.payload.initiator],
              }
            : user
        ),
      };
    },

    removeRelationship: (
      state: GlobalState,
      action: PayloadAction<{ initiator: string; target: string }>
    ): GlobalState => {
      console.log(action.payload);
      const updatedUsers = state.users.map((user: any) =>
        user.email === action.payload.initiator
          ? {
              ...user,
              following: user.following.filter(
                (email: string) => email !== action.payload.target
              ),
            }
          : user
      );

      return {
        ...state,
        users: updatedUsers.map((user: any) =>
          user.email === action.payload.target
            ? {
                ...user,
                followers: user.followers.filter(
                  (email: string) => email !== action.payload.initiator
                ),
              }
            : user
        ),
      };
    },

    resetUsers: (): GlobalState => {
      return initialState;
    },
  },
});

export const {
  addPost,
  addPostsChunk,
  likePost,
  commentOnPost,
  resetPosts,
  addNewSavedPost,
  addAllSavedPosts,
  removeSavedPost,
  removeAllSavedPosts,
  addNewUser,
  addAllUsers,
  addRelationship,
  removeRelationship,
  resetUsers,
} = globalSlice.actions;

export default globalSlice.reducer;

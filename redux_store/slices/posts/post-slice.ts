import { Like, Post, Saved } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPosts } from "../async-thunks";
import { Comment } from "@prisma/client";
import { StateType } from "@/redux_store/store";

type StatePost = Post & {
  likes: Like[];
  comments: Comment[];
  saved: Saved[];
};

interface PostState {
  posts: StatePost[];
  postStatus: "loading" | "succeeded" | "failed";
}

const initialState: PostState = {
  posts: [],
  postStatus: "loading" || "succeeded" || "failed",
};

const postsSlice = createSlice({
  name: "posts",
  initialState,

  reducers: {
    addPost: (state: PostState, action: PayloadAction<StatePost>) => {
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    },

    likePost: (
      state: PostState,
      action: PayloadAction<{ postId: string; like: Like }>
    ) => {
      const { postId, like } = action.payload;
      return {
        ...state,
        posts: state.posts.map((post: StatePost) =>
          post.id === postId ? { ...post, likes: [...post.likes, like] } : post
        ),
      };
    },

    commentOnPost: (
      state: PostState,
      action: PayloadAction<{ id: string; comment: Comment }>
    ) => {
      const { id, comment } = action.payload;
      return {
        ...state,
        posts: state.posts.map((post: StatePost) =>
          post.id === id
            ? { ...post, comments: [...post.comments, comment] }
            : post
        ),
      };
    },

    removeCommentFromPost: (
      state: PostState,
      action: PayloadAction<{ commentId: string; postId: string }>
    ) => {
      const { commentId, postId } = action.payload;

      const postIndex = state.posts.findIndex(
        (post: StatePost) => post.id === postId
      );

      if (postIndex !== -1) {
        const updatedComments = state.posts[postIndex].comments.filter(
          (comment) => comment.id !== commentId
        );

        const updatedPost = {
          ...state.posts[postIndex],
          comments: updatedComments,
        };

        const updatedPosts = [
          ...state.posts.slice(0, postIndex),
          updatedPost,
          ...state.posts.slice(postIndex + 1),
        ];

        return {
          ...state,
          posts: updatedPosts,
        };
      }
    },

    deletePost: (state: PostState, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      return {
        ...state,
        posts: state.posts.filter((post: StatePost) => post.id !== id),
      };
    },

    resetPosts: () => {
      return initialState;
    },

    editPost: (
      state: PostState,
      action: PayloadAction<{ id: string; editedPost: StatePost }>
    ) => {
      const { id, editedPost } = action.payload;
      return {
        ...state,
        posts: state.posts.map((post: StatePost) =>
          post.id === id ? editedPost : post
        ),
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state: PostState) => {
        return {
          ...state,
          postStatus: "loading",
        };
      })
      .addCase(
        fetchPosts.fulfilled,
        (state: PostState, action: PayloadAction<StatePost[]>) => {
          return {
            ...state,
            postStatus: "succeeded",
            posts: action.payload,
          };
        }
      )
      .addCase(fetchPosts.rejected, (state) => {
        console.log("Posts loading failed, check thunk");
        return {
          ...state,
          postStatus: "failed",
        };
      });
  },
});

export const {
  addPost,
  likePost,
  commentOnPost,
  removeCommentFromPost,
  editPost,
  deletePost,
  resetPosts,
} = postsSlice.actions;

export default postsSlice.reducer;

// Selectors

export const selectAllPosts = (state: StateType) => state.posts.posts;
export const selectPost = (state: StateType, postId: string) =>
  state.posts.posts.find((post: StatePost) => post.id === postId);

import { Post } from "@/types/post";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchPosts } from "../async-thunks";
import { Comment } from "@/types/comment";
import { StateType } from "@/redux_store/store";

interface PostState {
  posts: Post[];
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
    addPost: (state: PostState, action: PayloadAction<Post>) => {
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    },

    addPostsChunk: (state: PostState, action: PayloadAction<Post[]>) => {
      return {
        ...state,
        posts: action.payload,
      };
    },

    likePost: (state: PostState, action: PayloadAction<{ _id: string }>) => {
      const { _id } = action.payload;

      return {
        ...state,
        posts: state.posts.map((post: Post) =>
          post._id === _id ? { ...post, likes: Number(post.likes) + 1 } : post
        ),
      };
    },

    commentOnPost: (
      state: PostState,
      action: PayloadAction<{ _id: string; comment: Comment }>
    ) => {
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

    removeCommentFromPost: (
      state: PostState,
      action: PayloadAction<{ commentId: string; postId: string }>
    ) => {
      const { commentId, postId } = action.payload;

      const postIndex = state.posts.findIndex(
        (post: Post) => post._id === postId
      );

      if (postIndex !== -1) {
        const updatedComments = state.posts[postIndex].comments.filter(
          (comment) => comment._id !== commentId
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

    deletePost: (state: PostState, action: PayloadAction<{ _id: string }>) => {
      const { _id } = action.payload;
      return {
        ...state,
        posts: state.posts.filter((post: Post) => post._id !== _id),
      };
    },

    resetPosts: () => {
      return initialState;
    },

    editPost: (
      state: PostState,
      action: PayloadAction<{ _id: string; editedPost: Post }>
    ) => {
      const { _id, editedPost } = action.payload;
      return {
        ...state,
        posts: state.posts.map((post: Post) =>
          post._id === _id ? editedPost : post
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
        (state: PostState, action: PayloadAction<Post[]>) => {
          return {
            ...state,
            postStatus: "succeeded",
            posts: action.payload,
          };
        }
      )
      .addCase(fetchPosts.rejected, (state) => {
        return {
          ...state,
          postStatus: "failed",
        };
      });
  },
});

export const {
  addPost,
  addPostsChunk,
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

export const selectPostsForCurrentUser = createSelector(
  [selectAllPosts, (_: StateType, user: string) => user],
  (posts: Post[], user: string) =>
    posts.filter((post: Post) => post.email === user)
);

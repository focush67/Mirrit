import { Comment } from "@/types/comment";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/profile";
import { GlobalState, SavedPosts } from "@/types/state";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCluster, fetchPosts, fetchUsers } from "./async-thunks";

const defaultValue: GlobalState = {
  posts: [],
  users: [],
  saved: null,
  globals: undefined,
  status: "loading" || "succeeded" || "failed",
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

    deletePost: (
      state: GlobalState,
      action: PayloadAction<{ _id: string }>
    ): GlobalState => {
      const { _id } = action.payload;
      return {
        ...state,
        posts: state.posts.filter((post: Post) => post._id !== _id),
      };
    },

    resetPosts: (): GlobalState => {
      return initialState;
    },

    addNewSavedPost: (
      state: GlobalState,
      action: PayloadAction<{ email: string; postId: string }>
    ): GlobalState => {
      const { email, postId } = action.payload;

      return {
        ...state,
        saved: { email, posts: [...(state.saved?.posts || []), postId] },
      };
    },

    addAllSavedPosts: (
      state: GlobalState,
      action: PayloadAction<{ email: string; postIds: string[] }>
    ): GlobalState => {
      const { email, postIds } = action.payload;
      const allPostIds = state.saved?.posts
        ? [...state.saved.posts, ...postIds]
        : postIds;

      const uniquePostIds = Array.from(new Set(allPostIds));

      return {
        ...state,
        saved: {
          email,
          posts: uniquePostIds,
        },
      };
    },

    removeSavedPost: (
      state: GlobalState,
      action: PayloadAction<{ email: string; postId: string }>
    ): GlobalState => {
      const { email, postId } = action.payload;
      const newPosts =
        state.saved?.posts.filter((id: string) => id !== postId) || [];

      return {
        ...state,
        saved: { email, posts: newPosts },
      };
    },

    removeAllSavedPosts: (state: GlobalState): GlobalState => {
      return {
        ...state,
        saved: null,
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

    editPost: (
      state: GlobalState,
      action: PayloadAction<{ _id: string; editedPost: Post }>
    ): GlobalState => {
      const { _id } = action.payload;
      state.posts.map((post: Post) =>
        post._id === _id ? action.payload.editedPost : post
      );
      return state;
    },

    resetUsers: (): GlobalState => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state: GlobalState) => {
        state.status = "loading";
      })
      .addCase(
        fetchPosts.fulfilled,
        (state: GlobalState, action: PayloadAction<Post[]>) => {
          state.status = "succeeded";
          state.posts = action.payload;
        }
      )
      .addCase(fetchPosts.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserProfile[]>) => {
          state.status = "succeeded";
          state.users = action.payload;
        }
      )
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchCluster.pending, (state: GlobalState) => {
        state.status = "loading";
      })
      .addCase(
        fetchCluster.fulfilled,
        (state: GlobalState, action: PayloadAction<SavedPosts>) => {
          (state.status = "succeeded"), (state.saved = action.payload);
        }
      )
      .addCase(fetchCluster.rejected, (state: GlobalState) => {
        state.status = "failed";
      });
  },
});

export const {
  addPost,
  addPostsChunk,
  likePost,
  commentOnPost,
  deletePost,
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
  editPost,
} = globalSlice.actions;

export const selectAllPosts = (state: GlobalState) => state.posts;
export const selectAllUsers = (state: GlobalState) => state.users;
export const selectSavedCluster = (state: GlobalState) => state.saved;

export default globalSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSaved } from "../async-thunks";
import { Saved } from "@/types/saved";
import { StateType } from "@/redux_store/store";

interface SavedState {
  saved: Saved;
  savedStatus: "loading" | "succeeded" | "failed";
}

const initialState: SavedState = {
  saved: {
    email: "",
    postIds: [],
  },
  savedStatus: "loading" || "succeeded" || "failed",
};

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    addNewSavedPost: (
      state: SavedState,
      action: PayloadAction<{ email: string; postId: string }>
    ): SavedState => {
      const { email, postId } = action.payload;
      return {
        ...state,
        saved: { email, postIds: [...(state.saved.postIds || []), postId] },
      };
    },

    addAllSavedPosts: (
      state: SavedState,
      action: PayloadAction<{ email: string; postIds: string[] }>
    ): SavedState => {
      const { email, postIds } = action.payload;
      const allPostIds = state.saved.postIds
        ? [...state.saved.postIds, ...postIds]
        : postIds;

      const uniquePostIds = Array.from(new Set(allPostIds));

      return {
        ...state,
        saved: {
          email,
          postIds: uniquePostIds,
        },
      };
    },

    removeSavedPost: (
      state: SavedState,
      action: PayloadAction<{ email: string; postId: string }>
    ): SavedState => {
      const { email, postId } = action.payload;
      const newPosts =
        state.saved.postIds.filter((pId: string) => pId !== postId) || [];
      return {
        ...state,
        saved: { email, postIds: newPosts },
      };
    },

    removeAllSavedPosts: (state: SavedState): SavedState => {
      return {
        ...state,
        saved: {
          email: "",
          postIds: [],
        },
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSaved.pending, (state: SavedState) => {
        return {
          ...state,
          savedStatus: "loading",
        };
      })
      .addCase(
        fetchSaved.fulfilled,
        (
          state: SavedState,
          action: PayloadAction<{ savedPostsIds: string[]; email: string }>
        ) => {
          const { email, savedPostsIds } = action.payload;
          return {
            ...state,
            saved: {
              email: email,
              postIds: savedPostsIds,
            },
            savedStatus: "succeeded",
          };
        }
      )
      .addCase(fetchSaved.rejected, (state: SavedState) => {
        return {
          ...state,
          savedStatus: "failed",
        };
      });
  },
});

export const {
  addNewSavedPost,
  addAllSavedPosts,
  removeSavedPost,
  removeAllSavedPosts,
} = savedSlice.actions;

export default savedSlice.reducer;

// Selectors

export const selectSavedCluster = (state: StateType) => state.saved.saved;

export const selectSavedPosts = (state: StateType) => {
  const allPosts = state.posts.posts;
  const relevantPostsIds = state.saved;

  console.log({ relevantPostsIds });

  const savedPosts = allPosts?.filter((post) =>
    relevantPostsIds.saved.postIds?.includes(post._id)
  );

  return savedPosts;
};

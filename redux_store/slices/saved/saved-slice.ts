import { Follow, Post, User } from "@prisma/client";
import { StateType } from "@/redux_store/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { fetchSaved } from "../async-thunks";

interface SavedPost {
  user: User;
  savedPostsIds: string[];
}

interface SavedState {
  cluster: SavedPost | null;
  savedState: "loading" | "succeeded" | "failed";
}

const initialState: SavedState = {
  cluster: null,
  savedState: "loading",
};

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    addNewSavedPostState: (
      state: SavedState,
      action: PayloadAction<{ postId: string; owner: User }>
    ) => {
      const { postId, owner } = action.payload;
      if (!state.cluster) {
        state.cluster = {
          user: owner,
          savedPostsIds: [postId],
        };
      } else {
        state.cluster.savedPostsIds?.push(postId);
      }
    },
    removeSavedPostState: (
      state: SavedState,
      action: PayloadAction<{ postId: string }>
    ) => {
      const { postId } = action.payload;
      if (state.cluster) {
        state.cluster.savedPostsIds = state.cluster.savedPostsIds.filter(
          (id) => id !== postId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSaved.pending, (state) => {
        return {
          ...state,
          savedState: "loading",
        };
      })
      .addCase(
        fetchSaved.fulfilled,
        (state, action: PayloadAction<SavedPost>) => {
          state.savedState = "succeeded";
          state.cluster = action.payload;
        }
      )
      .addCase(fetchSaved.rejected, (state) => {
        return {
          ...state,
          savedState: "failed",
        };
      });
  },
});

export const { addNewSavedPostState, removeSavedPostState } =
  savedSlice.actions;
export default savedSlice.reducer;

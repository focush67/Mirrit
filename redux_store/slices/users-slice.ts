import { UserProfile } from "@/types/profile";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GlobalState } from "@/types/state";

const defaultValue: GlobalState = {
  users: [],
  posts: [],
};

const initialState: GlobalState = defaultValue;

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
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
        users: updatedUsers.map(
          (user: UserProfile): UserProfile =>
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
      const updatedUsers = state.users.map((user: UserProfile) =>
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
        users: updatedUsers.map((user: UserProfile) =>
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
  addNewUser,
  addAllUsers,
  addRelationship,
  removeRelationship,
  resetUsers,
} = usersSlice.actions;

export default usersSlice.reducer;

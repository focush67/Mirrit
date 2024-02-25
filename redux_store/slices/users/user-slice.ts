import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers } from "../async-thunks";
import { StateType } from "@/redux_store/store";
import { StateUser } from "@/types/user";

interface UserState {
  users: StateUser[];
  userStatus: "loading" | "succeeded" | "failed";
}
const initialState: UserState = {
  users: [],
  userStatus: "loading" || "succeeded" || "failed",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addNewUser: (state: UserState, action: PayloadAction<StateUser>) => {
      const userExists = state.users.some(
        (user: StateUser) => user.id === action.payload.id
      );
      if (userExists) {
        return state;
      }
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    },

    addRelationship: (
      state: UserState,
      action: PayloadAction<{ initiator: string; target: string }>
    ) => {
      const { initiator, target } = action.payload;

      const targetUser = state.users.find((user) => user.id === target);
      const initiatorUser = state.users.find((user) => user.id === initiator);

      if (targetUser && initiatorUser) {
        targetUser.followers.push(initiator);
        initiatorUser.followedProfiles.push(target);
      }
    },

    removeRelationship: (
      state: UserState,
      action: PayloadAction<{ initiator: string; target: string }>
    ) => {
      const { initiator, target } = action.payload;

      const targetUser = state.users.find((user) => user.id === target);
      const initiatorUser = state.users.find((user) => user.id === initiator);

      if (targetUser && initiatorUser) {
        targetUser.followers = targetUser.followers.filter(
          (follower) => follower !== initiator
        );
        initiatorUser.followedProfiles = initiatorUser.followedProfiles.filter(
          (profile) => profile !== target
        );
      }
    },

    removeFollower: (
      state: UserState,
      action: PayloadAction<{ initiator: string; target: string }>
    ) => {
      const { initiator, target } = action.payload;

      const initiatorUser = state.users.find((user) => user.id === initiator);
      const targetUser = state.users.find((user) => user.id === target);
      if (initiatorUser && targetUser) {
        initiatorUser.followers = initiatorUser.followers.filter(
          (follower) => follower !== target
        );
        targetUser.followedProfiles = targetUser.followedProfiles.filter(
          (profile) => profile !== initiator
        );
      }
    },

    resetUser: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        return {
          ...state,
          userStatus: "loading",
        };
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<StateUser[]>) => {
          return {
            ...state,
            userStatus: "succeeded",
            users: action.payload,
          };
        }
      )
      .addCase(fetchUsers.rejected, (state) => {
        console.log("User loading failed, check thunk");
        return {
          ...state,
          userStatus: "failed",
        };
      });
  },
});

export const {
  addNewUser,
  addRelationship,
  removeRelationship,
  resetUser,
  removeFollower,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors

export const selectCurrentUser = (state: StateType, userId: string) =>
  state.users.users.find((profile: StateUser) => profile.id === userId);

export const selectAllUsers = (state: StateType) => state.users.users;

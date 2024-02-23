import { Follow, User } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers } from "../async-thunks";
import { StateType } from "@/redux_store/store";

type StateUser = User & {
  following: Follow[];
  followedBy: Follow[];
};
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
      const updatedUsers = state.users.map((user: any) => {
        if (user.email === initiator) {
          return {
            ...user,
            following: [...user.following, target],
          };
        } else if (user.email === target) {
          return {
            ...user,
            followers: [...user.followers, initiator],
          };
        } else {
          return user;
        }
      });

      console.log("State after relationship follow: ", updatedUsers);

      return {
        ...state,
        users: updatedUsers,
      };
    },

    removeRelationship: (
      state: UserState,
      action: PayloadAction<{ initiator: string; target: string }>
    ) => {
      console.log(action.payload);
      const { initiator, target } = action.payload;

      const updatedUsers = state.users.map((user: StateUser) => {
        if (user.id === initiator) {
          return {
            ...user,
            followedBy: user.followedBy.filter(
              (follower: Follow) => follower.id !== target
            ),
          };
        } else if (user.id === target) {
          return {
            ...user,
            follower: user.following.filter(
              (follower: Follow) => follower.id !== initiator
            ),
          };
        } else {
          return user;
        }
      });

      console.log("State after relationship unfollow: ", updatedUsers);

      return {
        ...state,
        users: updatedUsers,
      };
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

export const { addNewUser, addRelationship, removeRelationship, resetUser } =
  userSlice.actions;

export default userSlice.reducer;

// Selectors

export const selectCurrentUser = (state: StateType, userId: string) =>
  state.users.users.find((profile: StateUser) => profile.id === userId);

export const selectAllUsers = (state: StateType) => state.users.users;

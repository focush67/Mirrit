import { AuthProfile, UserProfile } from "@/types/profile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers } from "../async-thunks";
import { StateType } from "@/redux_store/store";

interface UserState {
  users: UserProfile[];
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
    addNewUser: (state: UserState, action: PayloadAction<UserProfile>) => {
      const userExists = state.users.some(
        (user: UserProfile) => user.email === action.payload.email
      );
      if (userExists) {
        return state;
      }
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    },

    addAllUsers: (state: UserState, action: PayloadAction<UserProfile[]>) => {
      return {
        ...state,
        users: action.payload,
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

      const updatedUsers = state.users.map((user: UserProfile) => {
        if (user.email === initiator) {
          return {
            ...user,
            following: user.following.filter(
              (follower: AuthProfile) => follower.email !== target
            ),
          };
        } else if (user.email === target) {
          return {
            ...user,
            followers: user.followers.filter(
              (follower: AuthProfile) => follower.email !== initiator
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
        (state, action: PayloadAction<UserProfile[]>) => {
          return {
            ...state,
            userStatus: "succeeded",
            users: action.payload,
          };
        }
      )
      .addCase(fetchUsers.rejected, (state) => {
        return {
          ...state,
          userStatus: "failed",
        };
      });
  },
});

export const {
  addNewUser,
  addAllUsers,
  addRelationship,
  removeRelationship,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors

export const selectCurrentUser = (state: StateType, user: string) =>
  state.users.users.find((profile: UserProfile) => profile.email === user);

export const selectAllUsers = (state: StateType) => state.users.users;

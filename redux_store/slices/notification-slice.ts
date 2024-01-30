import { Notification } from "@/types/notification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Notification[] = [];

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state: Notification[],
      action: PayloadAction<Notification>
    ) => {
      state.push(action.payload);
    },

    resetNotifications: (state) => {
      state = [];
    },
  },
});

export const { addNotification, resetNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;

/**
 * This file defines the authentication slice using Redux Toolkit.
 * It manages the authentication state (user, status, and error), and handles login, register, and logout actions.
 */
import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./authThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

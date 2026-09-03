import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      // console.log(
      //   "action--------------------------------------------------",
      //   action,
      // );

      state.user = user;
      state.token = token;

      // Set token to cookie for middleware accessibility
      Cookies.set("hoodz_Dahboard_token", token, { path: "/" });
    },

    logout: (state) => {
      // Remove token for cookies
      Cookies.remove("hoodz_Dahboard_token", { path: "/" });
      state.user = null;
      state.token = null;
    },
  },
});

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

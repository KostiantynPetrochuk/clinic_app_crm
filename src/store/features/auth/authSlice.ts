import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const initialState = {};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (_, action) => {
      return action.payload;
    },
  },
});

export const { setAuthData } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;

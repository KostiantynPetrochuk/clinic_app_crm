import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../";

const initialState = {
  text: "",
  severity: "success",
  title: "Успіх!",
  vertical: "top",
  horizontal: "center",
  autoHideDuration: 3000,
  open: false,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage: (_, action) => action.payload,
    hideMessage: (state) => {
      state.open = false;
    },
  },
});

export const { setMessage, hideMessage } = messageSlice.actions;

export const selectMessage = (state: RootState) => state.message;
export default messageSlice.reducer;

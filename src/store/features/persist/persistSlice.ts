import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../";

const initialState = JSON.parse(localStorage.getItem("persist") || "false");

const persistSlice = createSlice({
  name: "persist",
  initialState,
  reducers: {
    setPersist: (_, action) => {
      return action.payload;
    },
  },
});

export const { setPersist } = persistSlice.actions;
export const selectPersist = (state: RootState) => state.persist;
export default persistSlice.reducer;

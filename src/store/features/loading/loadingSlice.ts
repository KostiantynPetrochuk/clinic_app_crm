import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../";

const initialState = false;

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (_, action) => {
      return action.payload;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export const selectLoading = (state: RootState) => state.loading;
export default loadingSlice.reducer;

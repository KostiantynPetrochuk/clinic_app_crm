import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const initialState: Doctor[] = [];

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctors: (_, action) => {
      return action.payload;
    },
  },
});

export const { setDoctors } = doctorsSlice.actions;
export const selectDoctors = (state: RootState) => state.doctors;
export default doctorsSlice.reducer;

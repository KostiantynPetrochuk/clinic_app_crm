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
    updateDoctor: (state, action) => {
      const { id, ...doctor } = action.payload;
      const index = state.findIndex((doctor) => doctor.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...doctor };
      }
    },
  },
});

export const { setDoctors, updateDoctor } = doctorsSlice.actions;
export const selectDoctors = (state: RootState) => state.doctors;
export default doctorsSlice.reducer;

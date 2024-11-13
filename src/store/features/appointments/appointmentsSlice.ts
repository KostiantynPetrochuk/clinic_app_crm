import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const initialState: Appointment[] = [];

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (_, action) => {
      return action.payload;
    },
    updateAppointment: (state, action) => {
      const { id, ...appointment } = action.payload;
      const index = state.findIndex((app) => app.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...appointment };
      }
    },
  },
});

export const { setAppointments, updateAppointment } = appointmentsSlice.actions;
export const selectAppointments = (state: RootState) => state.appointments;
export default appointmentsSlice.reducer;

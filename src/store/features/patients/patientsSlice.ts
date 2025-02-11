import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const initialState: Patient[] = [];

const patientsSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setPatients: (_, action) => {
      return action.payload;
    },
    updatePatient: (state, action) => {
      const { id, ...patient } = action.payload;
      const index = state.findIndex((patient) => patient.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...patient };
      }
    },
    addPatient: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setPatients, updatePatient, addPatient } = patientsSlice.actions;
export const selectPatients = (state: RootState) => state.patients;
export default patientsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const initialState: Application[] = [];

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    setApplications: (_, action) => {
      return action.payload;
    },
    updateApplication: (state, action) => {
      const { id, ...application } = action.payload;
      const index = state.findIndex((app) => app.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...application };
      }
    },
  },
});

export const { setApplications, updateApplication } = applicationsSlice.actions;
export const selectApplications = (state: RootState) => state.applications;
export default applicationsSlice.reducer;

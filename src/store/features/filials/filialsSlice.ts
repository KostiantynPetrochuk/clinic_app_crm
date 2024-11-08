import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const initialState: Filial[] = [];

const filialsSlice = createSlice({
  name: "filials",
  initialState,
  reducers: {
    setFilials: (_, action) => {
      return action.payload;
    },
    updateFilial: (state, action) => {
      const { id, ...filial } = action.payload;
      const index = state.findIndex((filial) => filial.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...filial };
      }
    },
  },
});

export const { setFilials, updateFilial } = filialsSlice.actions;
export const selectFilials = (state: RootState) => state.filials;
export default filialsSlice.reducer;

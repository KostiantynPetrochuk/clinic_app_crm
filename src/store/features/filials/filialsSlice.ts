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
  },
});

export const { setFilials } = filialsSlice.actions;
export const selectFilials = (state: RootState) => state.filials;
export default filialsSlice.reducer;

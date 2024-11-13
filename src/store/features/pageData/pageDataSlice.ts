import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const initialState: any = {};

const pageDataSlice = createSlice({
  name: "pageData",
  initialState,
  reducers: {
    setPageData: (_, action) => {
      return action.payload;
    },
  },
});

export const { setPageData } = pageDataSlice.actions;
export const selectPageData = (state: RootState) => state.pageData;
export default pageDataSlice.reducer;

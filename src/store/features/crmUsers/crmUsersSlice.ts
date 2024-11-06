import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../index";

const initialState: CrmUser[] = [];

const crmUsersSlice = createSlice({
  name: "crmUsers",
  initialState,
  reducers: {
    setCrmUsers: (_, action) => {
      return action.payload;
    },
  },
});

export const { setCrmUsers } = crmUsersSlice.actions;
export const selectCrmUsers = (state: RootState) => state.crmUsers;
export default crmUsersSlice.reducer;

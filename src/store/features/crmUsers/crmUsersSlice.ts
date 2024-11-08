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
    updateCrmUser: (state, action) => {
      const { id, ...user } = action.payload;
      const index = state.findIndex((user) => user.id === id);
      if (index !== -1) {
        state[index] = { ...state[index], ...user };
      }
    },
  },
});

export const { setCrmUsers, updateCrmUser } = crmUsersSlice.actions;
export const selectCrmUsers = (state: RootState) => state.crmUsers;
export default crmUsersSlice.reducer;

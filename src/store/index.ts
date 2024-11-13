import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import loadingReducer from "./features/loading/loadingSlice";
import messageReducer from "./features/message/messageSlice";
import persistReducer from "./features/persist/persistSlice";
import crmUsersReducer from "./features/crmUsers/crmUsersSlice";
import filialsReducer from "./features/filials/filialsSlice";
import doctorsReducer from "./features/doctors/doctorsSlice";
import patientsReducer from "./features/patients/patientsSlice";
import applicationReducer from "./features/applications/applicationsSlice";
import pageDataReducer from "./features/pageData/pageDataSlice";
import appointmentsReducer from "./features/appointments/appointmentsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crmUsers: crmUsersReducer,
    filials: filialsReducer,
    doctors: doctorsReducer,
    patients: patientsReducer,
    applications: applicationReducer,
    appointments: appointmentsReducer,
    pageData: pageDataReducer,
    persist: persistReducer,
    loading: loadingReducer,
    message: messageReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

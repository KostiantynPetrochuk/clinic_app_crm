import ukLocale from "date-fns/locale/uk";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Routes, Route } from "react-router-dom";

import { ROLES, APP_ROUTES } from "./constants";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import {
  Login,
  Unauthorized,
  Missing,
  Home,
  CrmUsers,
  CrmUserDetails,
  Filials,
  FilialDetails,
  Doctors,
  DoctorDetails,
  Patients,
  PatientDetails,
  Applications,
  AddAppointment,
  Appointments,
  EditAppointment,
} from "./pages";
import useUpdateInitData from "./hooks/useUpdateInitData";

import "./App.css";

function App() {
  useUpdateInitData();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ukLocale}>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<Layout />}>
          {/* publick routes */}
          <Route path={APP_ROUTES.LOGIN} element={<Login />} />
          <Route path={APP_ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={
                <RequireAuth
                  allowedRoles={[
                    ROLES.Developer,
                    ROLES.Founder,
                    ROLES.Administrator,
                  ]}
                />
              }
            >
              <Route path={APP_ROUTES.HOME} element={<Home />} />
              <Route
                path={APP_ROUTES.APPLICATIONS}
                element={<Applications />}
              />
              <Route
                path={APP_ROUTES.APPOINTMENTS}
                element={<Appointments />}
              />
              <Route
                path={APP_ROUTES.ADD_APPOINTMENT}
                element={<AddAppointment />}
              />
            </Route>

            <Route
              element={
                <RequireAuth allowedRoles={[ROLES.Developer, ROLES.Founder]} />
              }
            >
              <Route path={APP_ROUTES.CRM_USERS} element={<CrmUsers />} />
              <Route
                path={`${APP_ROUTES.CRM_USERS}/:id`}
                element={<CrmUserDetails />}
              />
              <Route path={APP_ROUTES.FILIALS} element={<Filials />} />
              <Route
                path={`${APP_ROUTES.FILIALS}/:id`}
                element={<FilialDetails />}
              />
              <Route path={APP_ROUTES.DOCTORS} element={<Doctors />} />
              <Route
                path={`${APP_ROUTES.DOCTORS}/:id`}
                element={<DoctorDetails />}
              />
              <Route path={APP_ROUTES.PATIENTS} element={<Patients />} />
              <Route
                path={`${APP_ROUTES.PATIENTS}/:id`}
                element={<PatientDetails />}
              />

              <Route
                path={`${APP_ROUTES.EDIT_APPOINTMENT}/:id`}
                element={<EditAppointment />}
              />
            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </LocalizationProvider>
  );
}

export default App;

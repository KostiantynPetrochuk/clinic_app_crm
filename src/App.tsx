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
} from "./pages";

import "./App.css";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ukLocale}>
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<Layout />}>
          {/* publick routes */}
          <Route path={APP_ROUTES.LOGIN} element={<Login />} />
          <Route path={APP_ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[ROLES.Developer]} />}>
              <Route path={APP_ROUTES.HOME} element={<Home />} />
              <Route path={APP_ROUTES.CRM_USERS} element={<CrmUsers />} />
              {/* Додаємо новий маршрут для детальної інформації про користувача */}
              <Route
                path={`${APP_ROUTES.CRM_USERS}/:id`}
                element={<CrmUserDetails />}
              />
              <Route path={APP_ROUTES.FILIALS} element={<Filials />} />
              <Route
                path={`${APP_ROUTES.FILIALS}/:id`}
                element={<FilialDetails />}
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

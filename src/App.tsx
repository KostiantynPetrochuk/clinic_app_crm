import ukLocale from "date-fns/locale/uk";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Routes, Route } from "react-router-dom";

import { ROLES, APP_ROUTES } from "./constants";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import { Login, Unauthorized, Missing, Home } from "./pages";

import "./App.css";

function App() {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ukLocale}
    >
      <Routes>
        <Route path={APP_ROUTES.HOME} element={<Layout />}>
          {/* publick routes */}
          <Route path={APP_ROUTES.LOGIN} element={<Login />} />
          <Route path={APP_ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[ROLES.Developer]} />}>
              <Route path={APP_ROUTES.HOME} element={<Home />} />
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

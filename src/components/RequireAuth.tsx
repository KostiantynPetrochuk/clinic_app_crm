import { useLocation, Navigate, Outlet } from "react-router-dom";

import { APP_ROUTES } from "../constants";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { auth } = useAuth();
  const location = useLocation();
  return auth?.roles?.find((role: string) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to={APP_ROUTES.UNAUTHORIZED} state={{ from: location }} replace />
  ) : (
    <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />
  );
};

export default RequireAuth;

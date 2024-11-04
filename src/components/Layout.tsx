import { Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Header from "./Header";
import Footer from "./Footer";
import useAuth from "../hooks/useAuth";

const Layout = () => {
  const { auth } = useAuth();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <main style={{ paddingBottom: isSm ? "60px" : "0" }}>
      {auth?.token && <Header />}
      <Outlet />
      {auth?.token && <Footer />}
    </main>
  );
};

export default Layout;

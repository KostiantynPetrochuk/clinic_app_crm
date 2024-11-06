import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";
import AppBar from "@mui/material/AppBar";
import GroupIcon from "@mui/icons-material/Group";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { APP_ROUTES } from "../constants";

const Footer = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const currentPage = window.location.pathname.split("/")[1];
  const [value, setValue] = useState(0);
  if (currentPage === "" && value !== 0) {
    setValue(0);
  }
  if (currentPage === "crm-users" && value !== 1) {
    setValue(1);
  }
  const handleNavigation = (_: any, newValue: number) => setValue(newValue);
  const navigateHome = () => navigate(APP_ROUTES.HOME);
  const navigateCrmUsers = () => navigate(APP_ROUTES.CRM_USERS);
  const navigateFilials = () => navigate(APP_ROUTES.FILIALS);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {isSm && (
        <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={handleNavigation}
          >
            <BottomNavigationAction
              label="Домашня"
              icon={<HomeIcon />}
              onClick={navigateHome}
            />
            <BottomNavigationAction
              label="Користувачі CRM"
              icon={<GroupIcon />}
              onClick={navigateCrmUsers}
            />
            <BottomNavigationAction
              label="Філії"
              icon={<BusinessIcon />}
              onClick={navigateFilials}
            />
          </BottomNavigation>
        </AppBar>
      )}
    </Box>
  );
};

export default Footer;

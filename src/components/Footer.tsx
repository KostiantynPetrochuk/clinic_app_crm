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
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import LocalHospital from "@mui/icons-material/LocalHospital";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import useLogout from "../hooks/useLogout";

import { APP_ROUTES } from "../constants";

const Footer = () => {
  const logout = useLogout();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setValue(-1);
  };
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const currentPage = window.location.pathname.split("/")[1];
  const [value, setValue] = useState(1);
  if (currentPage === "" && value !== 0) {
    setValue(0);
  }
  if (currentPage === "crm-users" && value !== 1) {
    setValue(1);
  }
  if (currentPage === "filials" && value !== 2) {
    setValue(2);
  }

  const handleNavigation = (_: any, newValue: number) => setValue(newValue);
  const navigateHome = () => navigate(APP_ROUTES.HOME);
  const navigateCrmUsers = () => navigate(APP_ROUTES.CRM_USERS);
  const navigateFilials = () => navigate(APP_ROUTES.FILIALS);
  const navigateDoctors = () => {
    handleClose();
    setValue(-1);
    navigate(APP_ROUTES.DOCTORS);
  };
  const navigatePatients = () => {
    handleClose();
    setValue(-1);
    navigate(APP_ROUTES.PATIENTS);
  };

  const handleLogout = async () => {
    await logout();
    navigate(APP_ROUTES.LOGIN);
  };

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
              label="Користувачі"
              icon={<GroupIcon />}
              onClick={navigateCrmUsers}
            />
            <BottomNavigationAction
              label="Філії"
              icon={<BusinessIcon />}
              onClick={navigateFilials}
            />
            <BottomNavigationAction
              label="Меню"
              icon={<MenuIcon />}
              onClick={handleMenu}
              sx={{ color: "default" }}
            />
          </BottomNavigation>
          <div>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={navigateDoctors}>
                <LocalHospital sx={{ mr: 1 }} color="action" />
                Лікарі
              </MenuItem>
              <MenuItem onClick={navigatePatients}>
                <AccountBoxIcon sx={{ mr: 1 }} color="action" />
                Пацієнти
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} color="action" />
                Вихід
              </MenuItem>
            </Menu>
          </div>
        </AppBar>
      )}
    </Box>
  );
};

export default Footer;

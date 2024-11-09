import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import { Paper } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import useMediaQuery from "@mui/material/useMediaQuery";
import LocalHospital from "@mui/icons-material/LocalHospital";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useTheme } from "@mui/material/styles";
import { APP_ROUTES } from "../constants";
import useLogout from "../hooks/useLogout";

const Header = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [state, setState] = React.useState(false);
  const navigate = useNavigate();
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate(APP_ROUTES.LOGIN);
  };

  // const isDeveloper = auth?.roles?.includes("Developer");

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        "key" in event &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setState(open);
    };

  if (isSm) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor={"left"} open={state} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250, textAlign: "center" }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <Box sx={{ width: "100%" }} role="presentation">
                <Paper
                  sx={{
                    padding: "6px 0",
                    margin: "8px",
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  }}
                >
                  Clinic
                </Paper>
              </Box>
              <List>
                <Link to={APP_ROUTES.HOME}>
                  <ListItem key={"home"} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <HomeIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Домашня сторінка"} />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to={APP_ROUTES.CRM_USERS}>
                  <ListItem key={"crm-users"} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <GroupIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Користувачі"} />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to={APP_ROUTES.FILIALS}>
                  <ListItem key={"filials"} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Філії"} />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to={APP_ROUTES.DOCTORS}>
                  <ListItem key={"doctors"} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <LocalHospital />
                      </ListItemIcon>
                      <ListItemText primary={"Лікарі"} />
                    </ListItemButton>
                  </ListItem>
                </Link>
                <Link to={APP_ROUTES.PATIENTS}>
                  <ListItem key={"patients"} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <AccountBoxIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Пацієнти"} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </List>
            </Box>
          </Drawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Clinic
          </Typography>
          <Button color="inherit" onClick={signOut} endIcon={<LogoutIcon />}>
            Вихід
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;

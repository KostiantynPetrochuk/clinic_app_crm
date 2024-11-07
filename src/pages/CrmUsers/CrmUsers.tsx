import { /* useNavigate, */ Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { APP_ROUTES } from "../../constants";
// import useFetchPrivate from "../../hooks/useFetchPrivate";
// import useMessage from "../../hooks/useMessage";
// import useLoading from "../../hooks/useLoading";
// import { useEffect } from "react";
import { /* useAppDispatch, */ useAppSelector } from "../../hooks";
import {
  selectCrmUsers,
  // setCrmUsers,
} from "../../store/features/crmUsers/crmUsersSlice";

const CrmUsers = () => {
  // const dispatch = useAppDispatch();
  // const fetchPrivate = useFetchPrivate();
  // const showMessage = useMessage();
  // const { startLoading, stopLoading } = useLoading();
  const crmUsers = useAppSelector(selectCrmUsers);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     startLoading();
  //     try {
  //       const { data, error } = await fetchPrivate("crm-users");
  //       if (error) {
  //         showMessage({
  //           title: "Помилка!",
  //           text: "Не вдалось отримати користувачів.",
  //           severity: "error",
  //         });
  //         return;
  //       }
  //       dispatch(setCrmUsers(data));
  //     } catch (error) {
  //       showMessage({
  //         title: "Помилка!",
  //         text: "Не вдалось отримати користувачів.",
  //         severity: "error",
  //       });
  //     } finally {
  //       stopLoading();
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <Container component="main">
      <Box>
        <Box component="div" sx={{ display: "flex", flexDirection: "column" }}>
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              marginTop: 2,
            }}
            elevation={24}
          >
            <Typography variant="h5" component="h2">
              Користувачі
            </Typography>
          </Paper>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                marginTop: 2,
              }}
              elevation={24}
            >
              {crmUsers.map((user) => (
                <List key={user.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to={`${APP_ROUTES.CRM_USERS}/${user.id}`}
                    >
                      <ListItemIcon>{user.id}</ListItemIcon>
                      <ListItemText
                        primary={`${user.lastName} ${user.firstName} ${user.middleName}`}
                        secondary={`Phone: ${user.phoneCountryCode}${user.phoneNumber}, Role: ${user.roles}`}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CrmUsers;

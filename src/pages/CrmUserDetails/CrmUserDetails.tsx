import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Avatar,
  Grid2 as Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import useFetchPrivate from "../../hooks/useFetchPrivate";
import useMessage from "../../hooks/useMessage";
import useLoading from "../../hooks/useLoading";
import { useAppDispatch } from "../../hooks";
import { updateCrmUser } from "../../store/features/crmUsers/crmUsersSlice";

const CrmUserDetails = () => {
  const dispatch = useAppDispatch();
  const fetchPrivate = useFetchPrivate();
  const showMessage = useMessage();
  const { startLoading, stopLoading } = useLoading();
  const [currentUser, setCurrentUser] = useState<CrmUser>();
  const [editMode, setEditMode] = useState(false);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    id: currentUser?.id || "",
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    middleName: currentUser?.middleName || "",
    phoneCountryCode: currentUser?.phoneCountryCode || "",
    phoneNumber: currentUser?.phoneNumber || "",
    roles: currentUser?.roles || [],
    access: currentUser?.access || false,
  });
  const [validation, setValidation] = useState({
    firstName: true,
    lastName: true,
    middleName: true,
    phoneCountryCode: true,
    phoneNumber: true,
    roles: true,
    access: true,
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setValidation({ ...validation, [name]: true });
    setFormData({ ...formData, [name]: value });
  };

  const handleSetEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleSubmit = () => {
    const updateUser = async () => {
      startLoading();
      const { data, error } = await fetchPrivate("crm-user", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      if (error) {
        stopLoading();
        showMessage({
          title: "Помилка!",
          text: "Не вдалось зберегти користувача.",
          severity: "error",
        });
        return;
      }
      setCurrentUser(data?.user);
      dispatch(updateCrmUser(data?.user));
      setEditMode(false);
      stopLoading();
      showMessage({
        title: "Успіх!",
        text: "Дані користувача успішно збережені.",
        severity: "success",
      });
    };
    if (!formData.firstName) {
      setValidation({ ...validation, firstName: false });
      showMessage({
        title: "Помилка!",
        text: "Не вказано ім'я користувача.",
        severity: "error",
      });
      return;
    }
    if (!formData.lastName) {
      setValidation({ ...validation, lastName: false });
      return;
    }
    if (!formData.middleName) {
      setValidation({ ...validation, middleName: false });
      showMessage({
        title: "Помилка!",
        text: "Не вказано по батькові користувача.",
        severity: "error",
      });
      return;
    }
    if (!formData.phoneCountryCode) {
      setValidation({ ...validation, phoneCountryCode: false });
      showMessage({
        title: "Помилка!",
        text: "Не вказано код країни телефону.",
        severity: "error",
      });
      return;
    }
    if (!formData.phoneNumber) {
      setValidation({ ...validation, phoneNumber: false });
      showMessage({
        title: "Помилка!",
        text: "Не вказано номер телефону.",
        severity: "error",
      });
      return;
    }
    if (!formData.roles) {
      setValidation({ ...validation, roles: false });
      showMessage({
        title: "Помилка!",
        text: "Не вказано посаду користувача.",
        severity: "error",
      });
      return;
    }
    if (formData.roles.length === 0) {
      setValidation({ ...validation, roles: false });
      showMessage({
        title: "Помилка!",
        text: "Не вказано посаду користувача.",
        severity: "error",
      });
      return;
    }
    if (formData.access === undefined) {
      setValidation({ ...validation, access: false });
      showMessage({
        title: "Помилка!",
        text: "Не вказано доступ користувача.",
        severity: "error",
      });
      return;
    }
    updateUser();
  };

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const { data, error } = await fetchPrivate("crm-user/" + id);
        if (error) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати користувачів.",
            severity: "error",
          });
          return;
        }
        setCurrentUser(data);
        setFormData({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          phoneCountryCode: data.phoneCountryCode,
          phoneNumber: data.phoneNumber,
          roles: data.roles,
          access: data.access,
        });
      } catch (error) {
        showMessage({
          title: "Помилка!",
          text: "Не вдалось отримати користувачів.",
          severity: "error",
        });
      } finally {
        stopLoading();
      }
    };
    fetchData();
  }, []);

  let title = "Завантаження...";
  let content = (
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
              {title}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );

  if (currentUser) {
    title = `Id: ${currentUser.id}`;
    content = (
      <Container component="main">
        <Box>
          <Box
            component="div"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                marginTop: 2,
              }}
              elevation={24}
            >
              <Typography variant="h5" component="h2">
                {title}
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
              {editMode ? (
                <Card
                  sx={{
                    maxWidth: 400,
                    margin: "auto",
                    padding: 2,
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid>
                        <Avatar sx={{ width: 60, height: 60 }}></Avatar>
                      </Grid>
                      <Grid sx={{ textAlign: "left" }}>
                        <Typography variant="h5">
                          Редагування користувача
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Прізвище"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          error={!validation.lastName}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Ім'я"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          error={!validation.firstName}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="По батькові"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleChange}
                          error={!validation.middleName}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Код країни телефону"
                          name="phoneCountryCode"
                          value={formData.phoneCountryCode}
                          onChange={handleChange}
                          error={!validation.phoneCountryCode}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Номер телефону"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          error={!validation.phoneNumber}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Посада"
                          name="roles"
                          value={formData.roles.join(",")}
                          error={!validation.roles}
                          onChange={(event) => {
                            const value = event.target.value;
                            const newValue = value.split(",");
                            setFormData({
                              ...formData,
                              roles: newValue,
                            });
                          }}
                        />
                      </Grid>
                      <Grid width={1}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Доступ
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.access}
                            label="Доступ"
                            onChange={(event) => {
                              const value = event.target.value;
                              const newValue = value === "true" ? true : false;
                              setFormData({
                                ...formData,
                                access: newValue,
                              });
                            }}
                          >
                            <MenuItem key={0} value={"false"}>
                              Заборонено
                            </MenuItem>
                            <MenuItem key={1} value={"true"}>
                              Дозволено
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={handleSetEditMode}
                        >
                          Скасувати
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleSubmit}
                        >
                          Записати
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  sx={{
                    maxWidth: 400,
                    margin: "auto",
                    padding: 2,
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid>
                        <Avatar sx={{ width: 60, height: 60 }}>
                          {currentUser.lastName[0]}
                          {currentUser.firstName[0]}
                        </Avatar>
                      </Grid>
                      <Grid sx={{ textAlign: "left" }}>
                        <Typography variant="h5">
                          {currentUser.lastName} {currentUser.firstName}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {currentUser.middleName}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      direction="column"
                      spacing={1}
                      sx={{ mt: 2, textAlign: "left" }}
                    >
                      <Grid>
                        <Typography variant="body1">
                          <strong>Телефон:</strong>{" "}
                          {currentUser.phoneCountryCode}
                          {currentUser.phoneNumber}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Посада:</strong>{" "}
                          {currentUser.roles.join(", ")}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Доступ:</strong>{" "}
                          {currentUser.access ? "Дозволено" : "Заборонено"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Button
                      sx={{ mt: 2 }}
                      variant="contained"
                      fullWidth
                      onClick={handleSetEditMode}
                    >
                      Редагувати
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    );
  }

  return <>{content}</>;
};

export default CrmUserDetails;

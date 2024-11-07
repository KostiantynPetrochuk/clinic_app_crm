import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
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
import { selectFilials } from "../../store/features/filials/filialsSlice";
import { useAppSelector } from "../../hooks";

const DoctorDetails = () => {
  const fetchPrivate = useFetchPrivate();
  const showMessage = useMessage();
  const { startLoading, stopLoading } = useLoading();
  const [currentDoctor, setCurrentDoctor] = useState<Doctor>();
  const [editMode, setEditMode] = useState(false);
  const { id } = useParams();
  const filials = useAppSelector(selectFilials);
  const doctorFilial = filials.find((f) => f.id === currentDoctor?.filialId);

  const [formData, setFormData] = useState({
    id: currentDoctor?.id || "",
    filialId: currentDoctor?.filialId || "",
    firstName: currentDoctor?.firstName || "",
    lastName: currentDoctor?.lastName || "",
    middleName: currentDoctor?.middleName || "",
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSetEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleSubmit = () => {
    const updateDoctor = async () => {
      startLoading();
      const { data, error } = await fetchPrivate("doctors", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      if (error) {
        stopLoading();
        showMessage({
          title: "Помилка!",
          text: "Не вдалось редагувати профіль лікаря.",
          severity: "error",
        });
        return;
      }
      setCurrentDoctor(data);
      setEditMode(false);
      stopLoading();
    };
    updateDoctor();
  };

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const { data, error } = await fetchPrivate("doctors/" + id);
        if (error) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати профіль лікаря.",
            severity: "error",
          });
          return;
        }
        setCurrentDoctor(data);
        setFormData({
          id: data.id,
          filialId: data.filialId,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
        });
      } catch (error) {
        showMessage({
          title: "Помилка!",
          text: "Не вдалось отримати профіль лікаря.",
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

  if (currentDoctor) {
    title = `Id: ${currentDoctor.id}`;
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
                      <Grid sx={{ textAlign: "left" }}>
                        <Typography variant="h5">
                          Редагування профілю лікаря
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Прізвище"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Ім'я"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="По-батькові"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Філія
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.filialId}
                            label="Філія"
                            onChange={(event) => {
                              const value = event.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                filialId: value,
                              }));
                            }}
                          >
                            {filials.map((filial) => (
                              <MenuItem key={filial.id} value={filial.id}>
                                {filial.city}
                              </MenuItem>
                            ))}
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
                    <Grid
                      container
                      direction="column"
                      spacing={1}
                      sx={{ mt: 2, textAlign: "left" }}
                    >
                      <Grid>
                        <Typography variant="body1">
                          <strong>Прізвище:</strong> {currentDoctor.lastName}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Ім'я:</strong> {currentDoctor.firstName}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>По-батькові:</strong>{" "}
                          {currentDoctor.middleName}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Область:</strong>{" "}
                          {doctorFilial?.region || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Місто:</strong>{" "}
                          {doctorFilial?.city || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Адреса:</strong>{" "}
                          {doctorFilial?.address || "Не вказано"}
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

export default DoctorDetails;

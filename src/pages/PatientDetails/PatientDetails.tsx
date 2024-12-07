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
import { useAppSelector, useAppDispatch } from "../../hooks";
import { updatePatient } from "../../store/features/patients/patientsSlice";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  format,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";

const PatientDetails = () => {
  const dispatch = useAppDispatch();
  const fetchPrivate = useFetchPrivate();
  const showMessage = useMessage();
  const { startLoading, stopLoading } = useLoading();
  const [currentPatient, setCurrentPatient] = useState<Patient>();
  const [editMode, setEditMode] = useState(false);
  const { id } = useParams();
  const filials = useAppSelector(selectFilials);
  const patientFilial = filials.find((f) => f.id === currentPatient?.filialId);

  const [formData, setFormData] = useState({
    id: currentPatient?.id || "",
    filialId: currentPatient?.filialId || "",
    phoneCountryCode: currentPatient?.phoneCountryCode || "",
    phone: currentPatient?.phoneNumber || "",
    firstName: currentPatient?.firstName || "",
    lastName: currentPatient?.lastName || "",
    middleName: currentPatient?.middleName || "",
    birthDate: currentPatient?.birthDate?.Time || "",
    placeOfResidence: currentPatient?.placeOfResidence || "",
    sex: currentPatient?.sex || "",
    passportSeries: currentPatient?.passportSeries || "",
    passportNumber: currentPatient?.passportNumber || "",
    idCardNumber: currentPatient?.idCardNumber || "",
    placeOfWork: currentPatient?.placeOfWork || "",
    position: currentPatient?.position || "",
    clientType: currentPatient?.clientType || "",
    cityOfResidence: currentPatient?.cityOfResidence || "",
  });
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSetEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleSubmit = () => {
    const updateCurrentPatient = async () => {
      startLoading();
      const body = {
        id: formData.id,
        filialId: formData.filialId,
        phoneCountryCode: formData.phoneCountryCode,
        phoneNumber: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        birthDate: formData.birthDate,
        placeOfResidence: formData.placeOfResidence,
        sex: formData.sex,
        passportSeries: formData.passportSeries,
        passportNumber: formData.passportNumber,
        idCardNumber: formData.idCardNumber,
        placeOfWork: formData.placeOfWork,
        position: formData.position,
        clientType: formData.clientType,
        cityOfResidence: formData.cityOfResidence,
      };
      const { data, error } = await fetchPrivate("patients", {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      if (error) {
        stopLoading();
        showMessage({
          title: "Помилка!",
          text: "Не вдалось редагувати профіль пацієнта.",
          severity: "error",
        });
        return;
      }
      dispatch(updatePatient(data));
      setCurrentPatient(data);
      setEditMode(false);
      stopLoading();
    };
    updateCurrentPatient();
  };

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const { data, error } = await fetchPrivate("patients/" + id);
        if (error) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати профіль пацієнта.",
            severity: "error",
          });
          return;
        }
        setCurrentPatient(data);
        setFormData({
          id: data.id,
          filialId: data.filialId,
          phoneCountryCode: data.phoneCountryCode,
          phone: data.phoneNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          birthDate: data.birthDate?.Time,
          placeOfResidence: data.placeOfResidence,
          sex: data.sex,
          passportSeries: data.passportSeries,
          passportNumber: data.passportNumber,
          idCardNumber: data.idCardNumber,
          placeOfWork: data.placeOfWork,
          position: data.position,
          clientType: data.clientType,
          cityOfResidence: data.cityOfResidence,
        });
      } catch (error) {
        showMessage({
          title: "Помилка!",
          text: "Не вдалось отримати профіль пацієнта.",
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

  if (currentPatient) {
    title = `Id: ${currentPatient.id}`;
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
                          Редагування профілю пацієнта
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
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Ім'я"
                          name="firstName"
                          value={formData.firstName}
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
                          <InputLabel id="phone-country-code-label">
                            Код країни телефону
                          </InputLabel>
                          <Select
                            labelId="phone-country-code-label"
                            id="phone-country-code"
                            name="phoneCountryCode"
                            value={formData.phoneCountryCode}
                            label="Код країни телефону"
                            onChange={handleChange}
                          >
                            <MenuItem value="+1">+1 (США)</MenuItem>
                            <MenuItem value="+44">
                              +44 (Великобританія)
                            </MenuItem>
                            <MenuItem value="+380">+380 (Україна)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Телефон"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <DatePicker
                          sx={{ width: "100%" }}
                          label="Дата народження"
                          name="birthDate"
                          value={
                            formData.birthDate
                              ? parseISO(formData.birthDate)
                              : null
                          }
                          onChange={(date) => {
                            if (!date) return;
                            const updatedDate = setMilliseconds(
                              setSeconds(setMinutes(setHours(date, 12), 0), 0),
                              0
                            );
                            setFormData((prev) => ({
                              ...prev,
                              birthDate: updatedDate.toISOString(),
                            }));
                          }}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Місце прописки"
                          name="placeOfResidence"
                          value={formData.placeOfResidence}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Стать
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.sex}
                            label="Стать"
                            onChange={(event) => {
                              const value = event.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                sex: value,
                              }));
                            }}
                          >
                            <MenuItem key={1} value="male">
                              Чоловік
                            </MenuItem>
                            <MenuItem key={2} value="female">
                              Жінка
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Серія паспорту"
                          name="passportSeries"
                          value={formData.passportSeries}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Номер паспорту"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Id картка"
                          name="idCardNumber"
                          value={formData.idCardNumber}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Місце роботи"
                          name="placeOfWork"
                          value={formData.placeOfWork}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Посада"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid width={1}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Тип клієнта
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.clientType}
                            label="Тип клієнта"
                            onChange={(event) => {
                              const value = event.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                clientType: value,
                              }));
                            }}
                          >
                            <MenuItem key={1} value="civil">
                              Цивільний
                            </MenuItem>
                            <MenuItem key={2} value="military">
                              Військовий
                            </MenuItem>
                            <MenuItem key={3} value="vpo">
                              ВПО
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Місце проживання"
                          name="cityOfResidence"
                          value={formData.cityOfResidence}
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
                          <strong>Прізвище:</strong> {currentPatient.lastName}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Ім'я:</strong> {currentPatient.firstName}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>По-батькові:</strong>{" "}
                          {currentPatient.middleName}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Телефон:</strong>{" "}
                          {currentPatient.phoneCountryCode}
                          {currentPatient.phoneNumber}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Філія:</strong>{" "}
                          {patientFilial?.city || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Дата народження:</strong>{" "}
                          {currentPatient.birthDate.Valid
                            ? format(
                                parseISO(currentPatient.birthDate.Time),
                                "dd.MM.yyyy"
                              )
                            : "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Місце прописки:</strong>{" "}
                          {currentPatient?.placeOfResidence || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Стать:</strong>{" "}
                          {currentPatient?.sex || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Серія паспорту:</strong>{" "}
                          {currentPatient?.passportSeries || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Номер паспорту:</strong>{" "}
                          {currentPatient?.passportNumber || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Id картка:</strong>{" "}
                          {currentPatient?.idCardNumber || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Місце роботи:</strong>{" "}
                          {currentPatient?.placeOfWork || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Посада:</strong>{" "}
                          {currentPatient?.position || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Тип клієнта:</strong>{" "}
                          {currentPatient?.clientType || "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Місце проживання:</strong>{" "}
                          {currentPatient?.cityOfResidence || "Не вказано"}
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

export default PatientDetails;

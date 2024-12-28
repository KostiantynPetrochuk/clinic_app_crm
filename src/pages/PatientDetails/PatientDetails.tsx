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
import Autocomplete from "@mui/material/Autocomplete";

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
import { REGIONS } from "../../constants/regions";
import { CITIES } from "../../constants/cities";

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
    sex: currentPatient?.sex || "",
    passportSeries: currentPatient?.passportSeries || "",
    passportNumber: currentPatient?.passportNumber || "",
    idCardNumber: currentPatient?.idCardNumber || "",
    placeOfWork: currentPatient?.placeOfWork || "",
    position: currentPatient?.position || "",
    clientType: currentPatient?.clientType || "",
    regionOfBirth: currentPatient?.regionOfBirth || "",
    cityOfBirth: currentPatient?.cityOfBirth || "",
    regionOfResidence: currentPatient?.cityOfResidence || "",
    cityOfResidence: currentPatient?.cityOfResidence || "",
    addressOfResidence: currentPatient?.addressOfResidence || "",
  });
  const [validation, setValidation] = useState({
    filialId: false,
    phoneCountryCode: false,
    phone: false,
    firstName: false,
    lastName: false,
    middleName: false,
    birthDate: false,
    placeOfResidence: false,
    sex: false,
    passportSeries: false,
    passportNumber: false,
    idCardNumber: false,
    placeOfWork: false,
    position: false,
    clientType: false,
    regionOfBirth: false,
    cityOfBirth: false,
    regionOfResidence: false,
    cityOfResidence: false,
    addressOfResidence: false,
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setValidation((prev) => ({ ...prev, [name]: false }));
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
        sex: formData.sex,
        passportSeries: formData.passportSeries,
        passportNumber: formData.passportNumber,
        idCardNumber: formData.idCardNumber,
        placeOfWork: formData.placeOfWork,
        position: formData.position,
        clientType: formData.clientType,
        regionOfBirth: formData.regionOfBirth,
        cityOfBirth: formData.cityOfBirth,
        regionOfResidence: formData.regionOfResidence,
        cityOfResidence: formData.cityOfResidence,
        addressOfResidence: formData.addressOfResidence,
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
      showMessage({
        title: "Успіх!",
        text: "Профіль пацієнта успішно відредаговано.",
        severity: "success",
      });
    };
    if (!formData.filialId) {
      setValidation((prev) => ({ ...prev, filialId: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть філію.",
        severity: "error",
      });
      return;
    }
    if (!formData.phoneCountryCode) {
      setValidation((prev) => ({ ...prev, phoneCountryCode: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть код країни телефону.",
        severity: "error",
      });
      return;
    }
    if (!formData.phone) {
      setValidation((prev) => ({ ...prev, phone: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть номер телефону.",
        severity: "error",
      });
      return;
    }
    if (!formData.firstName) {
      setValidation((prev) => ({ ...prev, firstName: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть ім'я.",
        severity: "error",
      });
      return;
    }
    if (!formData.lastName) {
      setValidation((prev) => ({ ...prev, lastName: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть прізвище.",
        severity: "error",
      });
      return;
    }
    if (!formData.middleName) {
      setValidation((prev) => ({ ...prev, middleName: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть по-батькові.",
        severity: "error",
      });
      return;
    }
    if (!formData.birthDate) {
      setValidation((prev) => ({ ...prev, birthDate: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть дату народження.",
        severity: "error",
      });
      return;
    }
    if (!formData.sex) {
      setValidation((prev) => ({ ...prev, sex: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть стать.",
        severity: "error",
      });
      return;
    }
    if (
      !formData.passportSeries &&
      !formData.passportNumber &&
      !formData.idCardNumber
    ) {
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть серію та номер паспорту, або номер id картки.",
        severity: "error",
      });
      return;
    }
    if (!formData.idCardNumber && !formData.passportSeries) {
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть серію паспорту або номер id картки.",
        severity: "error",
      });
      return;
    }
    if (!formData.idCardNumber && !formData.passportNumber) {
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть номер паспорту або номер id картки.",
        severity: "error",
      });
      return;
    }
    if (!formData.placeOfWork) {
      setValidation((prev) => ({ ...prev, placeOfWork: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть місце роботи.",
        severity: "error",
      });
      return;
    }
    if (!formData.position) {
      setValidation((prev) => ({ ...prev, position: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть посаду.",
        severity: "error",
      });
      return;
    }
    if (!formData.clientType) {
      setValidation((prev) => ({ ...prev, clientType: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть тип клієнта.",
        severity: "error",
      });
      return;
    }
    if (!formData.regionOfBirth) {
      setValidation((prev) => ({ ...prev, regionOfBirth: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть область народження.",
        severity: "error",
      });
      return;
    }
    if (!formData.cityOfBirth) {
      setValidation((prev) => ({ ...prev, cityOfBirth: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть місто народження.",
        severity: "error",
      });
      return;
    }
    if (!formData.regionOfResidence) {
      setValidation((prev) => ({ ...prev, regionOfResidence: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть область прописки.",
        severity: "error",
      });
      return;
    }
    if (!formData.cityOfResidence) {
      setValidation((prev) => ({ ...prev, cityOfResidence: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть місто прописки.",
        severity: "error",
      });
      return;
    }
    if (!formData.addressOfResidence) {
      setValidation((prev) => ({ ...prev, addressOfResidence: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть адресу прописки.",
        severity: "error",
      });
      return;
    }
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
          sex: data.sex,
          passportSeries: data.passportSeries,
          passportNumber: data.passportNumber,
          idCardNumber: data.idCardNumber,
          placeOfWork: data.placeOfWork,
          position: data.position,
          clientType: data.clientType,
          regionOfBirth: data.regionOfBirth,
          cityOfBirth: data.cityOfBirth,
          regionOfResidence: data.regionOfResidence,
          cityOfResidence: data.cityOfResidence,
          addressOfResidence: data.addressOfResidence,
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
                          error={validation.lastName}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Ім'я"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          error={validation.firstName}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="По-батькові"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleChange}
                          error={validation.middleName}
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
                            error={validation.phoneCountryCode}
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
                          error={validation.phone}
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
                            if (!date || isNaN(date.getTime())) {
                              setValidation((prev) => ({
                                ...prev,
                                birthDate: true,
                              }));
                              return;
                            }
                            const updatedDate = setMilliseconds(
                              setSeconds(setMinutes(setHours(date, 12), 0), 0),
                              0
                            );
                            setValidation((prev) => ({
                              ...prev,
                              birthDate: false,
                            }));
                            if (updatedDate && !isNaN(updatedDate.getTime())) {
                              setFormData((prev) => ({
                                ...prev,
                                birthDate: updatedDate.toISOString(),
                              }));
                            }
                          }}
                          onError={(error) => {
                            if (error) {
                              setValidation((prev) => ({
                                ...prev,
                                birthDate: true,
                              }));
                            }
                          }}
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
                            error={validation.sex}
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
                          // error={validation.passportSeries}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Номер паспорту"
                          name="passportNumber"
                          value={formData.passportNumber}
                          onChange={handleChange}
                          // error={validation.passportNumber}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Id картка"
                          name="idCardNumber"
                          value={formData.idCardNumber}
                          onChange={handleChange}
                          // error={validation.idCardNumber}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Місце роботи"
                          name="placeOfWork"
                          value={formData.placeOfWork}
                          onChange={handleChange}
                          error={validation.placeOfWork}
                        />
                      </Grid>
                      <Grid width={1}>
                        <TextField
                          fullWidth
                          label="Посада"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          error={validation.position}
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
                            error={validation.clientType}
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
                            error={validation.filialId}
                          >
                            {filials.map((filial) => (
                              <MenuItem key={filial.id} value={filial.id}>
                                {filial.city}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          marginTop: 1,
                        }}
                      >
                        Місце народження
                      </Typography>
                      <Grid
                        container
                        width={1}
                        display={"grid"}
                        spacing={2}
                        sx={{ mt: 2, textAlign: "left" }}
                      >
                        <Autocomplete
                          freeSolo
                          options={Object.keys(REGIONS).map((key) => ({
                            value: key,
                            label: REGIONS[key],
                          }))}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.label
                          }
                          value={
                            formData.regionOfBirth
                              ? {
                                  value: formData.regionOfBirth,
                                  label: REGIONS[formData.regionOfBirth] || "",
                                }
                              : null
                          }
                          onChange={(_, newValue) => {
                            setValidation((prev) => ({
                              ...prev,
                              regionOfBirth: false,
                            }));
                            setFormData({
                              ...formData,
                              regionOfBirth:
                                typeof newValue === "object" &&
                                newValue !== null &&
                                "value" in newValue
                                  ? newValue.value
                                  : "",
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              label="Область"
                              name="regionOfBirth"
                              value={
                                formData.regionOfBirth
                                  ? REGIONS[formData.regionOfBirth] || ""
                                  : ""
                              }
                              error={validation.regionOfBirth}
                            />
                          )}
                        />
                        <Autocomplete
                          freeSolo
                          options={Object.keys(
                            CITIES[formData.regionOfBirth] || {}
                          ).map((key) => ({
                            value: key,
                            label: CITIES[formData.regionOfBirth][key],
                          }))}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.label
                          }
                          value={
                            formData.cityOfBirth
                              ? {
                                  value: formData.cityOfBirth,
                                  label:
                                    CITIES[formData.regionOfBirth]?.[
                                      formData.cityOfBirth
                                    ] || "",
                                }
                              : null
                          }
                          onChange={(_, newValue) => {
                            setValidation((prev) => ({
                              ...prev,
                              cityOfBirth: false,
                            }));
                            setFormData({
                              ...formData,
                              cityOfBirth:
                                typeof newValue === "object" &&
                                newValue !== null &&
                                "value" in newValue
                                  ? newValue.value
                                  : "",
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Населений пункт"
                              fullWidth
                              error={validation.cityOfBirth}
                            />
                          )}
                        />
                      </Grid>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          marginTop: 1,
                        }}
                      >
                        Прописка
                      </Typography>
                      <Grid
                        container
                        display={"grid"}
                        width={1}
                        spacing={2}
                        sx={{ mt: 2, textAlign: "left" }}
                      >
                        <Autocomplete
                          freeSolo
                          options={Object.keys(REGIONS).map((key) => {
                            return {
                              value: key,
                              label: REGIONS[key],
                            };
                          })}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.label
                          }
                          value={
                            formData.regionOfResidence
                              ? {
                                  value: formData.regionOfResidence,
                                  label:
                                    REGIONS[formData.regionOfResidence] || "",
                                }
                              : null
                          }
                          onChange={(_, newValue) => {
                            setValidation((prev) => ({
                              ...prev,
                              regionOfResidence: false,
                            }));
                            setFormData({
                              ...formData,
                              regionOfResidence:
                                typeof newValue === "object" &&
                                newValue !== null &&
                                "value" in newValue
                                  ? newValue.value
                                  : "",
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              label="Область"
                              name="regionOfResidence"
                              value={
                                formData.regionOfResidence
                                  ? REGIONS[formData.regionOfResidence] || ""
                                  : ""
                              }
                              error={validation.regionOfResidence}
                            />
                          )}
                        />
                        <Autocomplete
                          freeSolo
                          options={Object.keys(
                            CITIES[formData.regionOfResidence] || {}
                          ).map((key) => ({
                            value: key,
                            label: CITIES[formData.regionOfResidence][key],
                          }))}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.label
                          }
                          value={
                            formData.cityOfResidence
                              ? {
                                  value: formData.cityOfResidence,
                                  label:
                                    CITIES[formData.regionOfResidence]?.[
                                      formData.cityOfResidence
                                    ] || "",
                                }
                              : null
                          }
                          onChange={(_, newValue) => {
                            setValidation((prev) => ({
                              ...prev,
                              cityOfResidence: false,
                            }));
                            setFormData({
                              ...formData,
                              cityOfResidence:
                                typeof newValue === "object" &&
                                newValue !== null &&
                                "value" in newValue
                                  ? newValue.value
                                  : "",
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Населений пункт"
                              fullWidth
                              error={validation.cityOfResidence}
                            />
                          )}
                        />
                        <Grid>
                          <TextField
                            fullWidth
                            label="Введіть адресу"
                            name="addressOfResidence"
                            value={formData.addressOfResidence || ""}
                            onChange={(e) => {
                              setValidation((prev) => ({
                                ...prev,
                                addressOfResidence: false,
                              }));
                              setFormData({
                                ...formData,
                                addressOfResidence: e.target.value,
                              });
                            }}
                            sx={{ mt: 2 }}
                            error={validation.addressOfResidence}
                          />
                        </Grid>
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
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          marginTop: 1,
                        }}
                      >
                        Місце народження
                      </Typography>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Область:</strong>{" "}
                          {REGIONS[currentPatient?.regionOfBirth] ||
                            "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Населений пункт:</strong>{" "}
                          {currentPatient?.regionOfBirth &&
                          currentPatient?.cityOfBirth &&
                          CITIES[currentPatient.regionOfBirth]?.[
                            currentPatient.cityOfBirth
                          ]
                            ? CITIES[currentPatient.regionOfBirth][
                                currentPatient.cityOfBirth
                              ]
                            : "Не вказано"}
                        </Typography>
                      </Grid>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          marginTop: 1,
                        }}
                      >
                        Прописка
                      </Typography>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Область:</strong>{" "}
                          {REGIONS[currentPatient?.regionOfResidence] ||
                            "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Населений пункт:</strong>{" "}
                          {currentPatient?.regionOfResidence &&
                          currentPatient?.cityOfResidence &&
                          CITIES[currentPatient.regionOfResidence]?.[
                            currentPatient.cityOfResidence
                          ]
                            ? CITIES[currentPatient.regionOfResidence][
                                currentPatient.cityOfResidence
                              ]
                            : "Не вказано"}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography variant="body1">
                          <strong>Адреса:</strong>{" "}
                          {currentPatient?.addressOfResidence || "Не вказано"}
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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid2 as Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CancelIcon from "@mui/icons-material/Cancel";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import BackspaceIcon from "@mui/icons-material/Backspace";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  format,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";

import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectPageData } from "../../store/features/pageData/pageDataSlice";
import { selectApplications } from "../../store/features/applications/applicationsSlice";
import useFetchPrivate from "../../hooks/useFetchPrivate";
import useMessage from "../../hooks/useMessage";
import { selectFilials } from "../../store/features/filials/filialsSlice";
import { selectDoctors } from "../../store/features/doctors/doctorsSlice";
import {
  selectPatients,
  addPatient,
} from "../../store/features/patients/patientsSlice";
import useLoading from "../../hooks/useLoading";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import { setPageData } from "../../store/features/pageData/pageDataSlice";
import { APP_ROUTES, WORKING_TIME } from "../../constants";
import Message from "../../components/Message";

type ButtonVariant = "contained" | "outlined" | "text";

const generateTimeSlots = (start: Date, end: Date) => {
  const times = [];
  let current = new Date(start.getTime());

  while (current <= end) {
    const hours = current.getHours().toString().padStart(2, "0");
    const minutes = current.getMinutes().toString().padStart(2, "0");
    times.push(`${hours}:${minutes}`);
    current.setMinutes(current.getMinutes() + 15);
  }

  return times;
};

const AddAppointment = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const showMessage = useMessage();
  const { startLoading, stopLoading } = useLoading();
  const fetchPrivate = useFetchPrivate();
  const filials = useAppSelector(selectFilials);
  const doctors = useAppSelector(selectDoctors);
  const pageData = useAppSelector(selectPageData);
  const patients = useAppSelector(selectPatients);
  const patientId = pageData.data?.patientId;
  const [currentPatientId, setCurrentPatientId] = useState(patientId ?? "");
  const applicationId = pageData.data?.applicationId;
  const applications = useAppSelector(selectApplications);
  const currentApplication = applications.find((a) => a.id === applicationId);
  const [patientLoading, setPatientLoading] = useState(true);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const patientFilial = filials.find((f) => f.id === currentPatient?.filialId);
  const [bookingTime, setBookingTime] = useState<string[]>([]);
  const [foundedPatient, setFoundedPatient] = useState<Patient>();
  const [searchPatientPhoneCode, setSearchPatientPhoneCode] = useState("");
  const [searchPatientPhone, setSearchPatientPhone] = useState("");
  const patientFormStateInitial = currentPatientId ? "show" : "search";
  const [patientFormState, setPatientFormState] = useState<
    "search" | "edit" | "add" | "show"
  >(patientFormStateInitial);

  const [appointmentFormData, setAppointmentFormData] = useState({
    doctorId: "",
    applicationId: currentApplication?.id || "",
    filialId: currentApplication?.filialId || "1",
    patientId: currentPatient?.id || "",
    serviceType: "",
    recordType: "",
    sourceOfInfo: "",
    startDateTime: currentApplication?.startDateTime || "",
    endDateTime: currentApplication?.endDateTime || "",
    price: 500,
    consentForTreatment: false,
    consentForDataProcessing: false,
  });
  const [patientFormData, setPatientFormData] = useState({
    id: currentPatient?.id || "",
    filialId: currentPatient?.filialId || "",
    phoneCountryCode: currentPatient?.phoneCountryCode || "",
    phoneNumber: currentPatient?.phoneNumber || "",
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
  const [selectedDate, setSelectedDate] = useState<Date>(
    currentApplication?.startDateTime
      ? parseISO(currentApplication?.startDateTime)
      : new Date()
  );

  const startTime = new Date();
  startTime.setHours(8, 30, 0, 0);
  const endTime = new Date();
  endTime.setHours(19, 30, 0, 0);

  const timeSlots = generateTimeSlots(startTime, endTime);

  const onChangeSearchPatientPhone = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, "");
    setSearchPatientPhone(numericValue);
  };

  const handleSearchPatient = (event: any) => {
    event.preventDefault();
    const foundPatient = patients.find((p) => {
      return (
        p.phoneNumber === searchPatientPhone &&
        p.phoneCountryCode === searchPatientPhoneCode
      );
    });
    setFoundedPatient(foundPatient);
    if (!foundPatient) {
      showMessage({
        title: "Увага!",
        text: "Пацієнта не знайдено.",
        severity: "warning",
      });
    }
  };

  const handleChangePatientData = (event: any) => {
    const { name, value } = event.target;
    setPatientFormData({ ...patientFormData, [name]: value });
  };

  const handleChangeDate = (date: Date) => {
    setSelectedDate(date);
    setAppointmentFormData((prev) => ({
      ...prev,
      startDateTime: "",
      endDateTime: "",
    }));
  };

  const handleClearTime = () => {
    setAppointmentFormData((prev) => ({
      ...prev,
      startDateTime: "",
      endDateTime: "",
    }));
  };

  const handleClickTimeSlot = (time: string) => {
    if (
      !appointmentFormData.startDateTime &&
      !appointmentFormData.endDateTime
    ) {
      const [hours, minutes] = time.split(":");
      const start = new Date(selectedDate);
      start.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setAppointmentFormData((prev) => ({
        ...prev,
        startDateTime: start.toISOString(),
      }));
    }
    if (appointmentFormData.startDateTime && !appointmentFormData.endDateTime) {
      const [hours, minutes] = time.split(":");
      const end = new Date(selectedDate);
      end.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const startDate = new Date(appointmentFormData.startDateTime);
      const endDate = new Date(end.toISOString());
      if (startDate > endDate) {
        setAppointmentFormData((prev) => ({
          ...prev,
          startDateTime: "",
          endDateTime: "",
        }));
        return;
      }
      const startTimeStr = startDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTimeStr = endDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const startIndex = WORKING_TIME.indexOf(startTimeStr);
      const endIndex = WORKING_TIME.indexOf(endTimeStr);
      const selectedTimeSlots = WORKING_TIME.slice(startIndex, endIndex + 1);
      const isOverlapping = selectedTimeSlots.some((time) =>
        bookingTime.includes(time)
      );
      if (isOverlapping) {
        console.log("Selected time slots overlap with booked time slots");
        setAppointmentFormData((prev) => ({
          ...prev,
          startDateTime: "",
          endDateTime: "",
        }));
        return;
      }
      setAppointmentFormData((prev) => ({
        ...prev,
        endDateTime: end.toISOString(),
      }));
    }
    if (appointmentFormData.startDateTime && appointmentFormData.endDateTime) {
      const [hours, minutes] = time.split(":");
      const start = new Date(selectedDate);
      start.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setAppointmentFormData((prev) => ({
        ...prev,
        startDateTime: start.toISOString(),
        endDateTime: "",
      }));
    }
  };

  const handleSubmitCreatePatient = async () => {
    const createNewPatient = async () => {
      startLoading();
      const body = {
        filialId: patientFormData.filialId,
        phoneCountryCode: patientFormData.phoneCountryCode,
        phoneNumber: patientFormData.phoneNumber,
        firstName: patientFormData.firstName,
        lastName: patientFormData.lastName,
        middleName: patientFormData.middleName,
        birthDate: patientFormData.birthDate,
        placeOfResidence: patientFormData.placeOfResidence,
        sex: patientFormData.sex,
        passportSeries: patientFormData.passportSeries,
        passportNumber: patientFormData.passportNumber,
        idCardNumber: patientFormData.idCardNumber,
        placeOfWork: patientFormData.placeOfWork,
        position: patientFormData.position,
        clientType: patientFormData.clientType,
        cityOfResidence: patientFormData.cityOfResidence,
      };
      const { data, error } = await fetchPrivate("patients", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (error) {
        stopLoading();
        showMessage({
          title: "Помилка!",
          text: "Не вдалось створити пацієнта.",
          severity: "error",
        });
        return;
      }
      dispatch(addPatient(data));
      setCurrentPatient(data);
      setCurrentPatientId(data.id);
      setPatientFormState("show");
      stopLoading();
    };
    createNewPatient();
  };

  const handleSubmitUpdatePatient = async () => {
    const updateCurrentPatient = async () => {
      startLoading();
      const body = {
        id: patientFormData.id,
        filialId: patientFormData.filialId,
        phoneCountryCode: patientFormData.phoneCountryCode,
        phoneNumber: patientFormData.phoneNumber,
        firstName: patientFormData.firstName,
        lastName: patientFormData.lastName,
        middleName: patientFormData.middleName,
        birthDate: patientFormData.birthDate,
        placeOfResidence: patientFormData.placeOfResidence,
        sex: patientFormData.sex,
        passportSeries: patientFormData.passportSeries,
        passportNumber: patientFormData.passportNumber,
        idCardNumber: patientFormData.idCardNumber,
        placeOfWork: patientFormData.placeOfWork,
        position: patientFormData.position,
        clientType: patientFormData.clientType,
        cityOfResidence: patientFormData.cityOfResidence,
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
      setCurrentPatient(data);
      stopLoading();
      setPatientFormState("show");
    };
    updateCurrentPatient();
  };

  const handleSubmitAppointment = async () => {
    startLoading();
    const body = {
      doctorId: appointmentFormData.doctorId,
      filialId: Number(appointmentFormData.filialId),
      applicationId: appointmentFormData.applicationId,
      patientId: appointmentFormData.patientId,
      serviceType: appointmentFormData.serviceType,
      recordType: appointmentFormData.recordType,
      sourceOfInfo: appointmentFormData.sourceOfInfo,
      startDateTime: appointmentFormData.startDateTime,
      endDateTime: appointmentFormData.endDateTime,
      price: appointmentFormData.price,
      consentForTreatment: appointmentFormData.consentForTreatment,
      consentForDataProcessing: appointmentFormData.consentForDataProcessing,
    };
    let url = "appointments";
    if (applicationId) {
      url = "appointments/via-application";
    }
    const { error } = await fetchPrivate(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (error) {
      showMessage({
        title: "Помилка!",
        text: "Не вдалось створити запис на прийом.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    dispatch(setPageData({}));
    stopLoading();
    navigate(APP_ROUTES.APPOINTMENTS);
  };

  useEffect(() => {
    const fetchData = async () => {
      setPatientLoading(true);
      try {
        const { data, error } = await fetchPrivate(
          "patients/" + currentPatientId
        );
        if (error) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати профіль пацієнта.",
            severity: "error",
          });
          return;
        }
        setCurrentPatient(data);
      } catch (error) {
        showMessage({
          title: "Помилка!",
          text: "Не вдалось отримати профіль пацієнта.",
          severity: "error",
        });
      } finally {
        setPatientLoading(false);
      }
    };
    if (currentPatientId) {
      fetchData();
    } else {
      setPatientLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentPatient) {
      setPatientFormData({
        id: currentPatient?.id || "",
        filialId: currentPatient?.filialId || "",
        phoneCountryCode: currentPatient?.phoneCountryCode || "",
        phoneNumber: currentPatient?.phoneNumber || "",
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
      setAppointmentFormData((prev) => ({
        ...prev,
        patientId: currentPatient?.id || "",
      }));
    }
  }, [currentPatient]);

  useEffect(() => {
    const fetchBookingTime = async () => {
      try {
        startLoading();
        const year = selectedDate.getFullYear();
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
        const day = selectedDate.getDate().toString().padStart(2, "0");
        const currentFilialId = appointmentFormData.filialId;
        const params = new URLSearchParams({
          filialId: currentFilialId.toString(),
          date: `${year}-${month}-${day}`,
        });
        const url = `booking?${params.toString()}`;
        const { data, error } = await fetchPrivate(url);
        if (error) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати зайнятий час.",
            severity: "error",
          });
          return;
        }
        let currentBookedTime: string[] = [];
        if (currentApplication) {
          const currentStartTimeStr = currentApplication?.startDateTime;
          const currentEndTimeStr = currentApplication?.endDateTime;
          const currentStartTime = new Date(currentStartTimeStr);
          const currentEndTime = new Date(currentEndTimeStr);
          const currentStart = currentStartTime.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const currentEnd = currentEndTime.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const currentIndex = WORKING_TIME.indexOf(currentStart);
          const endIndex = WORKING_TIME.indexOf(currentEnd);
          currentBookedTime = WORKING_TIME.slice(currentIndex, endIndex + 1);
          const updatedBookedTime = data.bookedTime.filter(
            (time: string) => !currentBookedTime.includes(time)
          );
          setBookingTime(updatedBookedTime);
        } else {
          setBookingTime(data.bookedTime);
        }
      } catch (error) {
        showMessage({
          title: "Помилка!",
          text: "Не вдалось отримати зайнятий час.",
          severity: "error",
        });
      } finally {
        stopLoading();
      }
    };
    fetchBookingTime();
  }, [selectedDate, appointmentFormData.filialId]);

  let patientContent = null;
  if (patientLoading) {
    patientContent = "Завантаження даних пацієнта...";
  }
  if (!patientLoading && currentPatient && patientFormState === "show") {
    patientContent = (
      <>
        <Grid
          container
          display={"grid"}
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
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
              <strong>По-батькові:</strong> {currentPatient.middleName}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1">
              <strong>Телефон:</strong> {currentPatient.phoneCountryCode}
              {currentPatient.phoneNumber}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1">
              <strong>Філія:</strong> {patientFilial?.city || "Не вказано"}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1">
              <strong>Дата народження:</strong>{" "}
              {currentPatient.birthDate.Valid
                ? format(parseISO(currentPatient.birthDate.Time), "dd.MM.yyyy")
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
              <strong>Стать:</strong> {currentPatient?.sex || "Не вказано"}
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
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          sx={{ mt: 2, width: "100%" }}
        >
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ flex: "1 1 auto", minWidth: "120px" }}
            onClick={() => {
              setPatientFormState("edit");
            }}
          >
            Редагувати
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ flex: "1 1 auto", minWidth: "120px" }}
            onClick={() => {
              console.log("Редагування пацієнта");
              setPatientFormState("search");
            }}
          >
            Вибрати іншого
          </Button>
        </Grid>
      </>
    );
  }

  if (!patientLoading && patientFormState === "edit") {
    patientContent = (
      <>
        <Grid
          container
          display={"grid"}
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          spacing={1}
          sx={{ mt: 2, textAlign: "left" }}
        >
          <Grid width={1}>
            <TextField
              fullWidth
              label="Прізвище"
              name="lastName"
              value={patientFormData.lastName}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Ім'я"
              name="firstName"
              value={patientFormData.firstName}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="По-батькові"
              name="middleName"
              value={patientFormData.middleName}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <DatePicker
              sx={{ width: "100%" }}
              label="Дата народження"
              name="birthDate"
              value={
                patientFormData.birthDate
                  ? parseISO(patientFormData.birthDate)
                  : null
              }
              onChange={(date) => {
                if (!date) return;
                const updatedDate = setMilliseconds(
                  setSeconds(setMinutes(setHours(date, 12), 0), 0),
                  0
                );
                setPatientFormData((prev) => ({
                  ...prev,
                  birthDate: updatedDate.toISOString(),
                }));
              }}
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
                value={patientFormData.phoneCountryCode}
                label="Код країни телефону"
                onChange={handleChangePatientData}
              >
                <MenuItem value="+1">+1 (США)</MenuItem>
                <MenuItem value="+44">+44 (Великобританія)</MenuItem>
                <MenuItem value="+380">+380 (Україна)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Телефон"
              name="phoneNumber"
              value={patientFormData.phoneNumber}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Місце прописки"
              name="placeOfResidence"
              value={patientFormData.placeOfResidence}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Стать</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={patientFormData.sex}
                label="Стать"
                onChange={(event) => {
                  const value = event.target.value;
                  setPatientFormData((prev) => ({
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
              value={patientFormData.passportSeries}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Номер паспорту"
              name="passportNumber"
              value={patientFormData.passportNumber}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Id картка"
              name="idCardNumber"
              value={patientFormData.idCardNumber}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Місце роботи"
              name="placeOfWork"
              value={patientFormData.placeOfWork}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Посада"
              name="position"
              value={patientFormData.position}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Тип клієнта</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={patientFormData.clientType}
                label="Тип клієнта"
                onChange={(event) => {
                  const value = event.target.value;
                  setPatientFormData((prev) => ({
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
              value={patientFormData.cityOfResidence}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Філія</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={patientFormData.filialId}
                label="Філія"
                onChange={(event) => {
                  const value = event.target.value;
                  setPatientFormData((prev) => ({
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
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          sx={{ mt: 2, width: "100%" }}
        >
          <Grid>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              sx={{ flex: "1 1 auto", minWidth: "120px" }}
              color="error"
              fullWidth
              onClick={() => {
                setPatientFormState("show");
              }}
            >
              Скасувати
            </Button>
          </Grid>
          <Grid>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              fullWidth
              onClick={handleSubmitUpdatePatient}
            >
              Зберегти
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }

  if (!patientLoading && patientFormState === "add") {
    patientContent = (
      <>
        <Grid
          container
          display={"grid"}
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          spacing={1}
          sx={{ mt: 2, textAlign: "left" }}
        >
          <Grid width={1}>
            <TextField
              fullWidth
              label="Прізвище"
              name="lastName"
              value={patientFormData.lastName}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Ім'я"
              name="firstName"
              value={patientFormData.firstName}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="По-батькові"
              name="middleName"
              value={patientFormData.middleName}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <DatePicker
              sx={{ width: "100%" }}
              label="Дата народження"
              name="birthDate"
              value={
                patientFormData.birthDate
                  ? parseISO(patientFormData.birthDate)
                  : null
              }
              onChange={(date) => {
                if (!date) return;
                const updatedDate = setMilliseconds(
                  setSeconds(setMinutes(setHours(date, 12), 0), 0),
                  0
                );
                setPatientFormData((prev) => ({
                  ...prev,
                  birthDate: updatedDate.toISOString(),
                }));
              }}
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
                value={patientFormData.phoneCountryCode}
                label="Код країни телефону"
                onChange={handleChangePatientData}
              >
                <MenuItem value="+1">+1 (США)</MenuItem>
                <MenuItem value="+44">+44 (Великобританія)</MenuItem>
                <MenuItem value="+380">+380 (Україна)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Телефон"
              name="phoneNumber"
              value={patientFormData.phoneNumber}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Місце прописки"
              name="placeOfResidence"
              value={patientFormData.placeOfResidence}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Стать</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={patientFormData.sex}
                label="Стать"
                onChange={(event) => {
                  const value = event.target.value;
                  setPatientFormData((prev) => ({
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
              value={patientFormData.passportSeries}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Номер паспорту"
              name="passportNumber"
              value={patientFormData.passportNumber}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Id картка"
              name="idCardNumber"
              value={patientFormData.idCardNumber}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Місце роботи"
              name="placeOfWork"
              value={patientFormData.placeOfWork}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Посада"
              name="position"
              value={patientFormData.position}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Тип клієнта</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={patientFormData.clientType}
                label="Тип клієнта"
                onChange={(event) => {
                  const value = event.target.value;
                  setPatientFormData((prev) => ({
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
              value={patientFormData.cityOfResidence}
              onChange={handleChangePatientData}
            />
          </Grid>
          <Grid width={1}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Філія</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={patientFormData.filialId}
                label="Філія"
                onChange={(event) => {
                  const value = event.target.value;
                  setPatientFormData((prev) => ({
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
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          sx={{ mt: 2, width: "100%" }}
        >
          <Grid>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              sx={{ flex: "1 1 auto", minWidth: "120px" }}
              color="error"
              fullWidth
              onClick={() => {
                setPatientFormState("search");
              }}
            >
              Скасувати
            </Button>
          </Grid>
          <Grid>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              fullWidth
              onClick={handleSubmitCreatePatient}
            >
              Зберегти
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
  if (!patientLoading && patientFormState === "search") {
    patientContent = (
      <Grid
        container
        display={"grid"}
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        spacing={1}
        sx={{ mt: 2, alignItems: "center" }}
      >
        <Grid width={1}>
          <FormControl fullWidth>
            <InputLabel id="phone-country-code-label">
              Код країни телефону
            </InputLabel>
            <Select
              labelId="phone-country-code-label"
              id="phone-country-code"
              name="phoneCountryCode"
              value={searchPatientPhoneCode}
              label="Код країни телефону"
              onChange={(event) => {
                const value = event.target.value;
                setSearchPatientPhoneCode(value);
              }}
            >
              <MenuItem value="+1">+1 (США)</MenuItem>
              <MenuItem value="+44">+44 (Великобританія)</MenuItem>
              <MenuItem value="+380">+380 (Україна)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid width={1}>
          <TextField
            fullWidth
            label="Телефон"
            name="phoneNumber"
            value={searchPatientPhone}
            onChange={onChangeSearchPatientPhone}
          />
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ flex: "1 1 auto", minWidth: "120px" }}
            onClick={handleSearchPatient}
          >
            Пошук
          </Button>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ flex: "1 1 auto", minWidth: "120px" }}
            onClick={() => {
              setPatientFormData({
                id: "",
                filialId: "",
                phoneCountryCode: "",
                phoneNumber: "",
                firstName: "",
                lastName: "",
                middleName: "",
                birthDate: "",
                placeOfResidence: "",
                sex: "",
                passportSeries: "",
                passportNumber: "",
                idCardNumber: "",
                placeOfWork: "",
                position: "",
                clientType: "",
                cityOfResidence: "",
              });
              setPatientFormState("add");
            }}
          >
            Новий пацієнт
          </Button>
        </Grid>
        {foundedPatient && (
          <>
            <Grid width={1}>
              <Typography variant="h6">Знайдений пацієнт:</Typography>
              <Typography variant="body1">
                <strong>Прізвище:</strong> {foundedPatient.lastName}
              </Typography>
              <Typography variant="body1">
                <strong>Ім'я:</strong> {foundedPatient.firstName}
              </Typography>
              <Typography variant="body1">
                <strong>По-батькові:</strong> {foundedPatient.middleName}
              </Typography>
              <Typography variant="body1">
                <strong>Телефон:</strong> {foundedPatient.phoneCountryCode}
                {foundedPatient.phoneNumber}
              </Typography>
            </Grid>
            <Grid
              container
              justifyContent="center"
              spacing={2}
              sx={{ width: "100%" }}
            >
              <Button
                variant="contained"
                startIcon={<FileDownloadDoneIcon />}
                sx={{ flex: "1 1 auto", minWidth: "120px" }}
                onClick={() => {
                  setAppointmentFormData((prev) => ({
                    ...prev,
                    patientId: foundedPatient.id,
                  }));
                  setCurrentPatientId(foundedPatient.id);
                  setCurrentPatient(foundedPatient);
                  setFoundedPatient(undefined);
                  setSearchPatientPhone("");
                  setPatientFormState("show");
                }}
              >
                Обрати
              </Button>
              <Button
                variant="outlined"
                startIcon={<BackspaceIcon />}
                sx={{ flex: "1 1 auto", minWidth: "120px" }}
                onClick={() => {
                  setSearchPatientPhone("");
                  setFoundedPatient(undefined);
                }}
              >
                Скинути
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    );
  }

  return (
    <Container component="main">
      <Message />
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
              Запис на прийом
            </Typography>
          </Paper>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                marginTop: 2,
                width: "100%",
              }}
              elevation={24}
            >
              <Typography variant="h5" component="h2">
                Пацієнт
              </Typography>
              {patientContent}
            </Paper>
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                marginTop: 2,
                width: "100%",
              }}
              elevation={24}
            >
              <DateCalendar
                disablePast
                value={selectedDate}
                showDaysOutsideCurrentMonth
                fixedWeekNumber={6}
                onChange={handleChangeDate}
              />
              <Grid
                justifyContent={"center"}
                container
                spacing={2}
                sx={{ mt: 2 }}
              >
                {timeSlots.map((time, index) => {
                  const slotDate = new Date(selectedDate);
                  const [hours, minutes] = time.split(":");
                  slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                  let buttonVariant: ButtonVariant = "outlined";
                  let disabled = false;
                  const startString = appointmentFormData.startDateTime;
                  const endString = appointmentFormData.endDateTime;
                  const now = new Date();
                  if (slotDate.getTime() < now.getTime()) {
                    buttonVariant = "outlined";
                    disabled = true;
                  } else if (bookingTime?.includes(time)) {
                    buttonVariant = "outlined";
                    disabled = true;
                  } else if (startString && !endString) {
                    const start = new Date(startString);
                    if (slotDate.getTime() === start.getTime()) {
                      buttonVariant = "contained";
                    }
                  } else if (startString && endString) {
                    if (
                      slotDate.getTime() >= new Date(startString).getTime() &&
                      slotDate.getTime() <= new Date(endString).getTime()
                    ) {
                      buttonVariant = "contained";
                    }
                  } else if (!startString && !endString) {
                    // console.log("none");
                  }

                  return (
                    <Grid key={index}>
                      <Button
                        disabled={disabled}
                        onClick={() => handleClickTimeSlot(time)}
                        variant={buttonVariant}
                        fullWidth
                      >
                        {time}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
              <Button
                variant="contained"
                startIcon={<BackspaceIcon />}
                sx={{ flex: "1 1 auto", minWidth: "120px", marginTop: 2 }}
                onClick={handleClearTime}
              >
                Скинути час
              </Button>
            </Paper>
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                marginTop: 2,
                width: "100%",
              }}
              elevation={24}
            >
              <Grid
                container
                display={"grid"}
                gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                spacing={1}
                sx={{ mt: 2, textAlign: "left" }}
              >
                <Grid width={1}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Філія</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={appointmentFormData.filialId}
                      label="Філія"
                      onChange={(event) => {
                        const value = event.target.value;
                        setAppointmentFormData((prev) => ({
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
                <Grid width={1}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Лікар</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={appointmentFormData.doctorId}
                      label="Лікар"
                      onChange={(event) => {
                        const value = event.target.value;
                        setAppointmentFormData((prev) => ({
                          ...prev,
                          doctorId: value,
                        }));
                      }}
                    >
                      {doctors.map((doctor) => (
                        <MenuItem key={doctor.id} value={doctor.id}>
                          {doctor.lastName} {doctor.firstName}{" "}
                          {doctor.middleName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid width={1}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Тип послуги
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={appointmentFormData.serviceType}
                      label="Тип клієнта"
                      onChange={(event) => {
                        const value = event.target.value;
                        setAppointmentFormData((prev) => ({
                          ...prev,
                          serviceType: value,
                        }));
                      }}
                    >
                      <MenuItem key={1} value="consultation">
                        Консультація
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid width={1}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Тип запису
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={appointmentFormData.recordType}
                      label="Тип запису"
                      onChange={(event) => {
                        const value = event.target.value;
                        setAppointmentFormData((prev) => ({
                          ...prev,
                          recordType: value,
                        }));
                      }}
                    >
                      <MenuItem key={1} value="website">
                        Заявка на сайті
                      </MenuItem>
                      <MenuItem key={2} value="reception">
                        Рецепсія
                      </MenuItem>
                      <MenuItem key={3} value="insurance_company">
                        Страхова компанія
                      </MenuItem>
                      <MenuItem key={4} value="by_phone">
                        По телефону
                      </MenuItem>
                      <MenuItem key={5} value="partner">
                        Партнер
                      </MenuItem>
                      <MenuItem key={6} value="contract">
                        Договір
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid width={1}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Як дізнались
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={appointmentFormData.sourceOfInfo}
                      label="Як дізнались"
                      onChange={(event) => {
                        const value = event.target.value;
                        setAppointmentFormData((prev) => ({
                          ...prev,
                          sourceOfInfo: value,
                        }));
                      }}
                    >
                      <MenuItem key={1} value="external_advertising">
                        Зовнішня реклама
                      </MenuItem>
                      <MenuItem key={2} value="instagram">
                        Інстаграм
                      </MenuItem>
                      <MenuItem key={3} value="facebook">
                        Фейсбук
                      </MenuItem>
                      <MenuItem key={4} value="print_advertising">
                        Друкована реклама
                      </MenuItem>
                      <MenuItem key={5} value="regular_customer">
                        Постійний клієнт
                      </MenuItem>
                      <MenuItem key={6} value="friends">
                        Друзі
                      </MenuItem>
                      <MenuItem key={7} value="business_cards">
                        Візитки
                      </MenuItem>
                      <MenuItem key={8} value="flyer">
                        Флаєр
                      </MenuItem>
                      <MenuItem key={9} value="website">
                        Сайт
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid width={1}>
                  <TextField
                    disabled
                    fullWidth
                    label="Вартість"
                    name="price"
                    value={"500"}
                  />
                </Grid>
              </Grid>
            </Paper>
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                marginTop: 2,
                marginBottom: 2,
                width: "100%",
              }}
              elevation={24}
            >
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ flex: "1 1 auto", minWidth: "120px" }}
                onClick={handleSubmitAppointment}
              >
                Зберегти
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AddAppointment;

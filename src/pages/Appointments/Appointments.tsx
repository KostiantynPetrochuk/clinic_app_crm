import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectAppointments } from "../../store/features/appointments/appointmentsSlice";
import { AppointmentItem } from "./partials";
import useLoading from "../../hooks/useLoading";
import useMessage from "../../hooks/useMessage";
import useFetchPrivate from "../../hooks/useFetchPrivate";
import { setAppointments } from "../../store/features/appointments/appointmentsSlice";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { selectFilials } from "../../store/features/filials/filialsSlice";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { selectCrmUsers } from "../../store/features/crmUsers/crmUsersSlice";
import { selectPatients } from "../../store/features/patients/patientsSlice";
import { selectDoctors } from "../../store/features/doctors/doctorsSlice";

const Appointments = () => {
  const dispatch = useAppDispatch();
  const fetchPrivate = useFetchPrivate();
  const { startLoading, stopLoading } = useLoading();
  const showMessage = useMessage();
  const appointments = useAppSelector(selectAppointments);
  const filials = useAppSelector(selectFilials);
  const crmUsers = useAppSelector(selectCrmUsers);
  const patients = useAppSelector(selectPatients);
  const doctors = useAppSelector(selectDoctors);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFilial, setSelectedFilial] = useState<number>(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("new");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedRecordType, setSelectedRecordType] = useState("");
  const [sourceOfInfo, setSourceOfInfo] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [diagnosisAdder, setDiagnosisAdder] = useState("");

  const handleChangeDate = (date: Date) => setSelectedDate(date);

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const dateString = selectedDate.toISOString();
        const params = new URLSearchParams({
          date: dateString,
          filialId: selectedFilial.toString(),
          status: selectedStatus,
          patientId: selectedPatient || "0",
          doctorId: selectedDoctor || "0",
          serviceType: selectedService,
          recordType: selectedRecordType,
          sourceOfInfo,
          reportedBy: reportedBy || "0",
          paymentType,
          diagnosisAdder: diagnosisAdder || "0",
        });
        const url = `appointments?${params.toString()}`;
        const { data, error } = await fetchPrivate(url);
        if (error) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати прийоми.",
            severity: "error",
          });
          return;
        }
        dispatch(setAppointments(data));
      } catch (error) {
        showMessage({
          title: "Помилка!",
          text: "Не вдалось отримати прийоми.",
          severity: "error",
        });
      } finally {
        stopLoading();
      }
    };
    fetchData();
  }, [
    selectedDate,
    selectedFilial,
    selectedStatus,
    selectedPatient,
    selectedDoctor,
    selectedService,
    selectedRecordType,
    sourceOfInfo,
    reportedBy,
    paymentType,
    diagnosisAdder,
  ]);

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
              Прийоми
            </Typography>
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
              value={selectedDate}
              showDaysOutsideCurrentMonth
              fixedWeekNumber={6}
              onChange={handleChangeDate}
            />
          </Paper>
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              marginTop: 2,
              width: "100%",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
            }}
            elevation={24}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Філія</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFilial}
                label="Філія"
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedFilial(Number(value));
                }}
              >
                {filials.map((filial) => (
                  <MenuItem key={filial.id} value={filial.id}>
                    {filial.city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Пацієнт</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPatient}
                label="Пацієнт"
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedPatient(value);
                }}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.lastName} {patient.firstName} {patient.middleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Лікар</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedDoctor}
                label="Лікар"
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedDoctor(value);
                }}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.lastName} {doctor.firstName} {doctor.middleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Тип послуги</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedService}
                label="Тип послуги"
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedService(value);
                }}
              >
                <MenuItem key={1} value="consultation">
                  Консультація
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Тип запису</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedRecordType}
                label="Тип запису"
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedRecordType(value);
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Як дізнались
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sourceOfInfo}
                label="Як дізнались"
                onChange={(event) => {
                  const value = event.target.value;
                  setSourceOfInfo(value);
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Звітував</InputLabel>
              <Select
                disabled={selectedStatus === "new"}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={reportedBy}
                label="Звітував"
                onChange={(event) => {
                  const value = event.target.value;
                  setReportedBy(value);
                }}
              >
                {crmUsers.map((crmUser) => (
                  <MenuItem key={crmUser.id} value={crmUser.id}>
                    {crmUser.lastName} {crmUser.firstName} {crmUser.middleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Тип оплати</InputLabel>
              <Select
                disabled={selectedStatus === "new"}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={paymentType}
                label="Тип оплати"
                onChange={(event) => {
                  const value = event.target.value;
                  setPaymentType(value);
                }}
              >
                <MenuItem key={1} value="cash">
                  Готівка
                </MenuItem>
                <MenuItem key={2} value="terminal">
                  Термінал
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Додав діагноз
              </InputLabel>
              <Select
                disabled={
                  selectedStatus === "new" || selectedStatus === "processing"
                }
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={diagnosisAdder}
                label="Додав діагноз"
                onChange={(event) => {
                  const value = event.target.value;
                  setDiagnosisAdder(value);
                }}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.lastName} {patient.firstName} {patient.middleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/*  */}
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Статус</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="new"
                  control={<Radio checked={selectedStatus === "new"} />}
                  label="Новий"
                  onChange={() => {
                    setSelectedStatus("new");
                  }}
                />
                <FormControlLabel
                  value="processing"
                  control={<Radio checked={selectedStatus === "processing"} />}
                  label="В обробці"
                  onChange={() => {
                    setSelectedStatus("processing");
                  }}
                />
                <FormControlLabel
                  value="done"
                  control={<Radio checked={selectedStatus === "done"} />}
                  label="Виконаний"
                  onChange={() => {
                    setSelectedStatus("done");
                  }}
                />
                <FormControlLabel
                  value="canceled"
                  control={<Radio checked={selectedStatus === "canceled"} />}
                  label="Скасований"
                  onChange={() => {
                    setSelectedStatus("canceled");
                  }}
                />
                <FormControlLabel
                  value="deleted"
                  control={<Radio checked={selectedStatus === "deleted"} />}
                  label="Видалений"
                  onChange={() => {
                    setSelectedStatus("deleted");
                  }}
                />
              </RadioGroup>
            </FormControl>
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
              startIcon={<BackspaceIcon />}
              sx={{ flex: "1 1 auto", minWidth: "120px" }}
              onClick={() => {
                setSelectedDate(new Date());
                setSelectedFilial(1);
                setSelectedStatus("new");
                setSelectedPatient("");
                setSelectedDoctor("");
                setSelectedService("");
                setSelectedRecordType("");
                setSourceOfInfo("");
                setReportedBy("");
                setPaymentType("");
                setDiagnosisAdder("");
              }}
            >
              Очистити
            </Button>
          </Paper>

          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 2,
            }}
          >
            {appointments.map((appointment: Appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Appointments;

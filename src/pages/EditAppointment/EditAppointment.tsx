import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Checkbox, FormControlLabel, Grid2 as Grid } from "@mui/material";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {
  format,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";

import { useAppSelector, useAppDispatch } from "../../hooks";
import useFetchPrivate from "../../hooks/useFetchPrivate";
import useMessage from "../../hooks/useMessage";
import { selectFilials } from "../../store/features/filials/filialsSlice";
import { selectDoctors } from "../../store/features/doctors/doctorsSlice";
import { selectCrmUsers } from "../../store/features/crmUsers/crmUsersSlice";
import {
  selectPatients,
  addPatient,
} from "../../store/features/patients/patientsSlice";
import useLoading from "../../hooks/useLoading";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import { setPageData } from "../../store/features/pageData/pageDataSlice";
import {
  APP_ROUTES,
  WORKING_TIME,
  SERVICE_PRICES,
  PHONE_COUNTRY_CODES,
  PATIENTS_TYPES,
  SEX,
  SOURCE_OF_INFO,
  RECORD_TYPES,
  PAYMENT_TYPES,
} from "../../constants";
import Message from "../../components/Message";
import { REGIONS } from "../../constants/regions";
import { CITIES } from "../../constants/cities";

type ButtonVariant = "contained" | "outlined" | "text";

type AppointmentFormData = {
  id: string | number | undefined;
  doctorId: string | number;
  filialId: string | number;
  patientId: string | number;
  serviceType: string;
  recordType: string;
  status?: string;
  sourceOfInfo: string;
  startDateTime: string;
  endDateTime: string;
  oldStartDateTime?: string;
  oldEndDateTime?: string;
  price: number;
  //
  aReporterId?: string | number;
  cancelReason?: string;
  consentForTreatment?: boolean;
  consentForDataProcessing?: boolean;
  paymentType?: string;
  diagnosisAdderId?: string | number;
  diagnosis?: string;
  recommendations?: string;
  comment?: string;
};

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

const EditAppointment = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const showMessage = useMessage();
  const { startLoading, stopLoading } = useLoading();
  const fetchPrivate = useFetchPrivate();
  const filials = useAppSelector(selectFilials);
  const doctors = useAppSelector(selectDoctors);
  const crmUsers = useAppSelector(selectCrmUsers);
  const patients = useAppSelector(selectPatients);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment>();
  const [patientLoading, setPatientLoading] = useState(true);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const patientFilial = filials.find((f) => f.id === currentPatient?.filialId);
  const [bookingTime, setBookingTime] = useState<string[]>([]);
  const [foundedPatient, setFoundedPatient] = useState<Patient>();
  const [searchPatientPhoneCode, setSearchPatientPhoneCode] = useState("");
  const [searchPatientPhone, setSearchPatientPhone] = useState("");
  const patientFormStateInitial = "show";
  const [patientFormState, setPatientFormState] = useState<
    "search" | "edit" | "add" | "show"
  >(patientFormStateInitial);

  const [appointmentFormData, setAppointmentFormData] =
    useState<AppointmentFormData>({
      id: currentAppointment?.id || "",
      doctorId: currentAppointment?.doctorId || "",
      filialId: currentAppointment?.filialId || "1",
      patientId: currentPatient?.id || "",
      serviceType: currentAppointment?.serviceType || "",
      recordType: currentAppointment?.recordType || "",
      sourceOfInfo: currentAppointment?.sourceOfInfo || "",
      startDateTime: currentAppointment?.startDateTime || "",
      endDateTime: currentAppointment?.endDateTime || "",
      oldStartDateTime: currentAppointment?.startDateTime || "",
      oldEndDateTime: currentAppointment?.endDateTime || "",
      price: 0,
      aReporterId: currentAppointment?.aReporterId?.Int64 || "",
      cancelReason: currentAppointment?.cancelReason?.String || "",
      consentForTreatment: currentAppointment?.consentForTreatment || false,
      consentForDataProcessing:
        currentAppointment?.consentForDataProcessing || false,
      paymentType: currentAppointment?.paymentType?.String || "",
      diagnosisAdderId: currentAppointment?.diagnosisAdderId?.Int64 || "",
      diagnosis: currentAppointment?.diagnosis?.String || "",
      recommendations: currentAppointment?.recommendations?.String || "",
      comment: currentAppointment?.comment?.String || "",
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
    patientId: false,
    startDateTime: false,
    endDateTime: false,
    filialId: false,
    doctorId: false,
    serviceType: false,
    recordType: false,
    sourceOfInfo: false,
    aReporterId: false,
    paymentType: false,
    diagnosisAdderId: false,
  });
  const [patientValidation, setPatientValidation] = useState({
    filialId: false,
    phoneCountryCode: false,
    phoneNumber: false,
    firstName: false,
    lastName: false,
    middleName: false,
    birthDate: false,
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

  const [openDeleteReport, setOpenDeleteReport] = useState(false);
  const handleToggleDeleteReport = () => {
    setOpenDeleteReport(!openDeleteReport);
  };
  const handleDeleteReport = async () => {
    startLoading();
    const body = {
      appointmentId: currentAppointment?.id,
    };
    const { error } = await fetchPrivate("appointments/delete-report", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    if (error) {
      stopLoading();
      showMessage({
        title: "Помилка!",
        text: "Не вдалось видалити звіт.",
        severity: "error",
      });
      return;
    }
    stopLoading();
    navigate(APP_ROUTES.APPOINTMENTS);
  };

  const [openDeleteDiagnosis, setOpenDeleteDiagnosis] = useState(false);
  const handleToggleDeleteDiagnosis = () => {
    setOpenDeleteDiagnosis(!openDeleteDiagnosis);
  };
  const handleDeleteDiagnosis = async () => {
    startLoading();
    const body = {
      appointmentId: currentAppointment?.id,
    };
    const { error } = await fetchPrivate("appointments/delete-diagnosis", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    if (error) {
      stopLoading();
      showMessage({
        title: "Помилка!",
        text: "Не вдалось видалити діагноз.",
        severity: "error",
      });
      return;
    }
    stopLoading();
    navigate(APP_ROUTES.APPOINTMENTS);
  };

  const [selectedDate, setSelectedDate] = useState<Date>(
    currentAppointment?.startDateTime
      ? parseISO(currentAppointment?.startDateTime)
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
    setPatientValidation((prev) => ({ ...prev, [name]: false }));
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
        showMessage({
          title: "Увага!",
          text: "Будь ласка, оберіть інший час, який не перетинається із вже зайнятим.",
          severity: "warning",
        });
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
        sex: patientFormData.sex,
        passportSeries: patientFormData.passportSeries,
        passportNumber: patientFormData.passportNumber,
        idCardNumber: patientFormData.idCardNumber,
        placeOfWork: patientFormData.placeOfWork,
        position: patientFormData.position,
        clientType: patientFormData.clientType,
        regionOfBirth: patientFormData.regionOfBirth,
        cityOfBirth: patientFormData.cityOfBirth,
        regionOfResidence: patientFormData.regionOfResidence,
        cityOfResidence: patientFormData.cityOfResidence,
        addressOfResidence: patientFormData.addressOfResidence,
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
      setPatientFormState("show");
      stopLoading();
    };
    if (!patientFormData.lastName) {
      setPatientValidation((prev) => ({ ...prev, lastName: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть прізвище.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.firstName) {
      setPatientValidation((prev) => ({ ...prev, firstName: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть ім'я.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.middleName) {
      setPatientValidation((prev) => ({ ...prev, middleName: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть по-батькові.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.birthDate) {
      setPatientValidation((prev) => ({ ...prev, birthDate: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть дату народження.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.phoneCountryCode) {
      setPatientValidation((prev) => ({ ...prev, phoneCountryCode: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть код країни телефону.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.phoneNumber) {
      setPatientValidation((prev) => ({ ...prev, phoneNumber: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть номер телефону.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.sex) {
      setPatientValidation((prev) => ({ ...prev, sex: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть стать.",
        severity: "error",
      });
      return;
    }
    if (
      !patientFormData.passportSeries &&
      !patientFormData.passportNumber &&
      !patientFormData.idCardNumber
    ) {
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть серію та номер паспорту, або номер id картки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.idCardNumber && !patientFormData.passportSeries) {
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть серію паспорту або номер id картки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.idCardNumber && !patientFormData.passportNumber) {
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть номер паспорту або номер id картки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.placeOfWork) {
      setPatientValidation((prev) => ({ ...prev, placeOfWork: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть місце роботи.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.position) {
      setPatientValidation((prev) => ({ ...prev, position: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть посаду.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.clientType) {
      setPatientValidation((prev) => ({ ...prev, clientType: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть тип клієнта.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.regionOfBirth) {
      setPatientValidation((prev) => ({ ...prev, regionOfBirth: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть область народження.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.cityOfBirth) {
      setPatientValidation((prev) => ({ ...prev, cityOfBirth: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть місто народження.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.regionOfResidence) {
      setPatientValidation((prev) => ({ ...prev, regionOfResidence: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть область прописки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.cityOfResidence) {
      setPatientValidation((prev) => ({ ...prev, cityOfResidence: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть місто прописки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.addressOfResidence) {
      setPatientValidation((prev) => ({ ...prev, addressOfResidence: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть адресу прописки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.filialId) {
      setPatientValidation((prev) => ({ ...prev, filialId: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть філію.",
        severity: "error",
      });
      return;
    }
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
        sex: patientFormData.sex,
        passportSeries: patientFormData.passportSeries,
        passportNumber: patientFormData.passportNumber,
        idCardNumber: patientFormData.idCardNumber,
        placeOfWork: patientFormData.placeOfWork,
        position: patientFormData.position,
        clientType: patientFormData.clientType,
        regionOfBirth: patientFormData.regionOfBirth,
        cityOfBirth: patientFormData.cityOfBirth,
        regionOfResidence: patientFormData.regionOfResidence,
        cityOfResidence: patientFormData.cityOfResidence,
        addressOfResidence: patientFormData.addressOfResidence,
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
    if (!patientFormData.lastName) {
      setPatientValidation((prev) => ({ ...prev, lastName: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть прізвище.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.firstName) {
      setPatientValidation((prev) => ({ ...prev, firstName: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть ім'я.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.middleName) {
      setPatientValidation((prev) => ({ ...prev, middleName: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть по-батькові.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.birthDate) {
      setPatientValidation((prev) => ({ ...prev, birthDate: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть дату народження.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.phoneCountryCode) {
      setPatientValidation((prev) => ({ ...prev, phoneCountryCode: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть код країни телефону.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.phoneNumber) {
      setPatientValidation((prev) => ({ ...prev, phoneNumber: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть номер телефону.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.sex) {
      setPatientValidation((prev) => ({ ...prev, sex: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть стать.",
        severity: "error",
      });
      return;
    }
    if (
      !patientFormData.passportSeries &&
      !patientFormData.passportNumber &&
      !patientFormData.idCardNumber
    ) {
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть серію та номер паспорту, або номер id картки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.idCardNumber && !patientFormData.passportSeries) {
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть серію паспорту або номер id картки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.idCardNumber && !patientFormData.passportNumber) {
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть номер паспорту або номер id картки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.placeOfWork) {
      setPatientValidation((prev) => ({ ...prev, placeOfWork: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть місце роботи.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.position) {
      setPatientValidation((prev) => ({ ...prev, position: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть посаду.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.clientType) {
      setPatientValidation((prev) => ({ ...prev, clientType: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть тип клієнта.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.regionOfBirth) {
      setPatientValidation((prev) => ({ ...prev, regionOfBirth: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть область народження.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.cityOfBirth) {
      setPatientValidation((prev) => ({ ...prev, cityOfBirth: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть місто народження.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.regionOfResidence) {
      setPatientValidation((prev) => ({ ...prev, regionOfResidence: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть область прописки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.cityOfResidence) {
      setPatientValidation((prev) => ({ ...prev, cityOfResidence: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть місто прописки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.addressOfResidence) {
      setPatientValidation((prev) => ({ ...prev, addressOfResidence: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть адресу прописки.",
        severity: "error",
      });
      return;
    }
    if (!patientFormData.filialId) {
      setPatientValidation((prev) => ({ ...prev, filialId: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть філію.",
        severity: "error",
      });
      return;
    }
    updateCurrentPatient();
  };

  const handleSubmitAppointment = async () => {
    startLoading();
    const body: AppointmentFormData = {
      id: currentAppointment?.id,
      doctorId: appointmentFormData.doctorId,
      filialId: Number(appointmentFormData.filialId),
      patientId: appointmentFormData.patientId,
      serviceType: appointmentFormData.serviceType,
      recordType: appointmentFormData.recordType,
      status: currentAppointment?.status,
      sourceOfInfo: appointmentFormData.sourceOfInfo,
      startDateTime: appointmentFormData.startDateTime,
      endDateTime: appointmentFormData.endDateTime,
      oldStartDateTime: currentAppointment?.startDateTime,
      oldEndDateTime: currentAppointment?.endDateTime,
      price: appointmentFormData.price,
      consentForTreatment: appointmentFormData.consentForTreatment,
      consentForDataProcessing: appointmentFormData.consentForDataProcessing,
    };
    if (currentAppointment?.status === "canceled") {
      body.cancelReason = appointmentFormData.cancelReason;
      body.aReporterId = appointmentFormData.aReporterId;
    }
    if (currentAppointment?.status === "processing") {
      body.paymentType = appointmentFormData.paymentType;
      body.aReporterId = appointmentFormData.aReporterId;
    }
    if (currentAppointment?.status === "done") {
      body.paymentType = appointmentFormData.paymentType;
      body.aReporterId = appointmentFormData.aReporterId;
      body.diagnosisAdderId = appointmentFormData.diagnosisAdderId;
      body.diagnosis = appointmentFormData.diagnosis;
      body.recommendations = appointmentFormData.recommendations;
      body.comment = appointmentFormData.comment;
    }
    if (!appointmentFormData.patientId) {
      setValidation((prev) => ({ ...prev, patientId: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть пацієнта, або створіть нового.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (!appointmentFormData.startDateTime) {
      setValidation((prev) => ({ ...prev, startDateTime: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть час початку запису.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (!appointmentFormData.endDateTime) {
      setValidation((prev) => ({ ...prev, endDateTime: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, виберіть час завершення запису.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (!appointmentFormData.filialId) {
      setValidation((prev) => ({ ...prev, filialId: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, оберіть філію.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (!appointmentFormData.doctorId) {
      setValidation((prev) => ({ ...prev, doctorId: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, оберіть лікаря.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (!appointmentFormData.serviceType) {
      setValidation((prev) => ({ ...prev, serviceType: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, оберіть тип послуги.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (!appointmentFormData.recordType) {
      setValidation((prev) => ({ ...prev, recordType: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, оберіть тип запису.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (!appointmentFormData.sourceOfInfo) {
      setValidation((prev) => ({ ...prev, sourceOfInfo: true }));
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, оберіть джерело інформації.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    const url = "appointments/edit";
    const { error } = await fetchPrivate(url, {
      method: "PATCH",
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
        sex: currentPatient?.sex || "",
        passportSeries: currentPatient?.passportSeries || "",
        passportNumber: currentPatient?.passportNumber || "",
        idCardNumber: currentPatient?.idCardNumber || "",
        placeOfWork: currentPatient?.placeOfWork || "",
        position: currentPatient?.position || "",
        clientType: currentPatient?.clientType || "",
        regionOfBirth: currentPatient?.regionOfBirth || "",
        cityOfBirth: currentPatient?.cityOfBirth || "",
        regionOfResidence: currentPatient?.regionOfResidence || "",
        cityOfResidence: currentPatient?.cityOfResidence || "",
        addressOfResidence: currentPatient?.addressOfResidence || "",
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
        if (currentAppointment) {
          const currentStartTimeStr = currentAppointment?.startDateTime;
          const currentEndTimeStr = currentAppointment?.endDateTime;
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

  useEffect(() => {
    const fetchInitData = async () => {
      setPatientLoading(true);
      startLoading();
      try {
        const { data: appointmentData, error: appointmentError } =
          await fetchPrivate("appointments/" + id);
        if (appointmentError) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати дані запису на прийом.",
            severity: "error",
          });
          return;
        }
        if (appointmentData.status === "deleted") {
          navigate(APP_ROUTES.APPOINTMENTS);
          return;
        }
        setCurrentAppointment(appointmentData);
        const appointmentDataBody: AppointmentFormData = {
          id: appointmentData.id,
          doctorId: appointmentData.doctorId,
          filialId: appointmentData.filialId,
          patientId: appointmentData.patientId,
          serviceType: appointmentData.serviceType,
          recordType: appointmentData.recordType,
          sourceOfInfo: appointmentData.sourceOfInfo,
          startDateTime: appointmentData.startDateTime,
          endDateTime: appointmentData.endDateTime,
          price: appointmentData.price,
          consentForTreatment: appointmentData.consentForTreatment,
          consentForDataProcessing: appointmentData.consentForDataProcessing,
        };
        if (appointmentData?.aReporterId?.Valid) {
          appointmentDataBody.aReporterId = appointmentData.aReporterId.Int64;
        }
        if (appointmentData?.cancelReason?.Valid) {
          appointmentDataBody.cancelReason =
            appointmentData.cancelReason.String;
        }
        if (appointmentData?.paymentType?.Valid) {
          appointmentDataBody.paymentType = appointmentData.paymentType.String;
        }
        if (appointmentData?.diagnosisAdderId?.Valid) {
          appointmentDataBody.diagnosisAdderId =
            appointmentData.diagnosisAdderId.Int64;
        }
        if (appointmentData?.diagnosis?.Valid) {
          appointmentDataBody.diagnosis = appointmentData.diagnosis.String;
        }
        if (appointmentData?.recommendations?.Valid) {
          appointmentDataBody.recommendations =
            appointmentData.recommendations.String;
        }
        if (appointmentData?.comment?.Valid) {
          appointmentDataBody.comment = appointmentData.comment.String;
        }
        setAppointmentFormData(appointmentDataBody);
        setSelectedDate(parseISO(appointmentData.startDateTime));
        const { data: patientData, error: patientError } = await fetchPrivate(
          "patients/" + appointmentData.patientId
        );
        if (patientError) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати профіль пацієнта.",
            severity: "error",
          });
          return;
        }
        setCurrentPatient(patientData);
      } catch (error) {
        showMessage({
          title: "Помилка!",
          text: "Не вдалось отримати профіль пацієнта.",
          severity: "error",
        });
      } finally {
        setPatientLoading(false);
        stopLoading();
      }
    };
    fetchInitData();
  }, []);

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
          display={"grid"}
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          spacing={1}
          sx={{ mt: 2, textAlign: "left" }}
        >
          <Grid>
            <Typography variant="body1">
              <strong>Область:</strong>{" "}
              {REGIONS[currentPatient?.regionOfBirth] || "Не вказано"}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1">
              <strong>Населений пункт:</strong>{" "}
              {currentPatient?.regionOfBirth &&
              currentPatient?.cityOfBirth &&
              CITIES[currentPatient.regionOfBirth]?.[currentPatient.cityOfBirth]
                ? CITIES[currentPatient.regionOfBirth][
                    currentPatient.cityOfBirth
                  ]
                : "Не вказано"}
            </Typography>
          </Grid>
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
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          spacing={1}
          sx={{ mt: 2, textAlign: "left" }}
        >
          <Grid>
            <Typography variant="body1">
              <strong>Область:</strong>{" "}
              {REGIONS[currentPatient?.regionOfResidence] || "Не вказано"}
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
            onClick={() => setPatientFormState("search")}
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
          spacing={2}
          sx={{ mt: 2, textAlign: "left" }}
        >
          <Grid width={1}>
            <TextField
              fullWidth
              label="Прізвище"
              name="lastName"
              value={patientFormData.lastName}
              onChange={handleChangePatientData}
              error={patientValidation.lastName}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Ім'я"
              name="firstName"
              value={patientFormData.firstName}
              onChange={handleChangePatientData}
              error={patientValidation.firstName}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="По-батькові"
              name="middleName"
              value={patientFormData.middleName}
              onChange={handleChangePatientData}
              error={patientValidation.middleName}
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
                if (!date || isNaN(date.getTime())) {
                  setPatientValidation((prev) => ({
                    ...prev,
                    birthDate: true,
                  }));
                  return;
                }
                const updatedDate = setMilliseconds(
                  setSeconds(setMinutes(setHours(date, 12), 0), 0),
                  0
                );
                setPatientValidation((prev) => ({
                  ...prev,
                  birthDate: false,
                }));
                if (updatedDate && !isNaN(updatedDate.getTime())) {
                  setPatientFormData((prev) => ({
                    ...prev,
                    birthDate: updatedDate.toISOString(),
                  }));
                }
              }}
              onError={(error) => {
                if (error) {
                  setPatientValidation((prev) => ({
                    ...prev,
                    birthDate: true,
                  }));
                }
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
                error={patientValidation.phoneCountryCode}
              >
                {Object.keys(PHONE_COUNTRY_CODES).map((key) => (
                  <MenuItem key={key} value={key}>
                    {
                      PHONE_COUNTRY_CODES[
                        key as keyof typeof PHONE_COUNTRY_CODES
                      ]
                    }
                  </MenuItem>
                ))}
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
              error={patientValidation.phoneNumber}
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
                  setPatientValidation((prev) => ({
                    ...prev,
                    sex: false,
                  }));
                  setPatientFormData((prev) => ({
                    ...prev,
                    sex: value,
                  }));
                }}
                error={patientValidation.sex}
              >
                {Object.keys(SEX).map((key) => (
                  <MenuItem key={key} value={key}>
                    {SEX[key as keyof typeof SEX]}
                  </MenuItem>
                ))}
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
              error={patientValidation.placeOfWork}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Посада"
              name="position"
              value={patientFormData.position}
              onChange={handleChangePatientData}
              error={patientValidation.position}
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
                  setPatientValidation((prev) => ({
                    ...prev,
                    clientType: false,
                  }));
                  setPatientFormData((prev) => ({
                    ...prev,
                    clientType: value,
                  }));
                }}
                error={patientValidation.clientType}
              >
                {Object.keys(PATIENTS_TYPES).map((key) => (
                  <MenuItem key={key} value={key}>
                    {PATIENTS_TYPES[key as keyof typeof PATIENTS_TYPES]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                  setPatientValidation((prev) => ({
                    ...prev,
                    filialId: false,
                  }));
                  setPatientFormData((prev) => ({
                    ...prev,
                    filialId: value,
                  }));
                }}
                error={patientValidation.filialId}
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
          display={"grid"}
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          spacing={1}
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
              patientFormData.regionOfBirth
                ? {
                    value: patientFormData.regionOfBirth,
                    label: REGIONS[patientFormData.regionOfBirth] || "",
                  }
                : null
            }
            onChange={(_, newValue) => {
              setPatientValidation((prev) => ({
                ...prev,
                regionOfBirth: false,
              }));
              setPatientFormData({
                ...patientFormData,
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
                  patientFormData.regionOfBirth
                    ? REGIONS[patientFormData.regionOfBirth] || ""
                    : ""
                }
                error={patientValidation.regionOfBirth}
              />
            )}
          />
          <Autocomplete
            freeSolo
            options={Object.keys(
              CITIES[patientFormData.regionOfBirth] || {}
            ).map((key) => ({
              value: key,
              label: CITIES[patientFormData.regionOfBirth][key],
            }))}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.label
            }
            value={
              patientFormData.cityOfBirth
                ? {
                    value: patientFormData.cityOfBirth,
                    label:
                      CITIES[patientFormData.regionOfBirth]?.[
                        patientFormData.cityOfBirth
                      ] || "",
                  }
                : null
            }
            onChange={(_, newValue) => {
              setPatientValidation((prev) => ({
                ...prev,
                cityOfBirth: false,
              }));
              setPatientFormData({
                ...patientFormData,
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
                error={patientValidation.cityOfBirth}
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
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          spacing={1}
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
              patientFormData.regionOfResidence
                ? {
                    value: patientFormData.regionOfResidence,
                    label: REGIONS[patientFormData.regionOfResidence] || "",
                  }
                : null
            }
            onChange={(_, newValue) => {
              setPatientValidation((prev) => ({
                ...prev,
                regionOfResidence: false,
              }));
              setPatientFormData({
                ...patientFormData,
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
                  patientFormData.regionOfResidence
                    ? REGIONS[patientFormData.regionOfResidence] || ""
                    : ""
                }
                error={patientValidation.regionOfResidence}
              />
            )}
          />

          <Autocomplete
            freeSolo
            options={Object.keys(
              CITIES[patientFormData.regionOfResidence] || {}
            ).map((key) => ({
              value: key,
              label: CITIES[patientFormData.regionOfResidence][key],
            }))}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.label
            }
            value={
              patientFormData.cityOfResidence
                ? {
                    value: patientFormData.cityOfResidence,
                    label:
                      CITIES[patientFormData.regionOfResidence]?.[
                        patientFormData.cityOfResidence
                      ] || "",
                  }
                : null
            }
            onChange={(_, newValue) => {
              setPatientValidation((prev) => ({
                ...prev,
                cityOfResidence: false,
              }));
              setPatientFormData({
                ...patientFormData,
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
                error={patientValidation.cityOfResidence}
              />
            )}
          />
          <Grid>
            <TextField
              fullWidth
              label="Введіть адресу"
              name="addressOfResidence"
              value={patientFormData.addressOfResidence || ""}
              onChange={(e) => {
                setPatientValidation((prev) => ({
                  ...prev,
                  addressOfResidence: false,
                }));
                setPatientFormData({
                  ...patientFormData,
                  addressOfResidence: e.target.value,
                });
              }}
              sx={{ mt: 2 }}
              error={patientValidation.addressOfResidence}
            />
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
          spacing={2}
          sx={{ mt: 2, textAlign: "left" }}
        >
          <Grid width={1}>
            <TextField
              fullWidth
              label="Прізвище"
              name="lastName"
              value={patientFormData.lastName}
              onChange={handleChangePatientData}
              error={patientValidation.lastName}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Ім'я"
              name="firstName"
              value={patientFormData.firstName}
              onChange={handleChangePatientData}
              error={patientValidation.firstName}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="По-батькові"
              name="middleName"
              value={patientFormData.middleName}
              onChange={handleChangePatientData}
              error={patientValidation.middleName}
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
                if (!date || isNaN(date.getTime())) {
                  setPatientValidation((prev) => ({
                    ...prev,
                    birthDate: true,
                  }));
                  return;
                }
                const updatedDate = setMilliseconds(
                  setSeconds(setMinutes(setHours(date, 12), 0), 0),
                  0
                );
                setPatientValidation((prev) => ({
                  ...prev,
                  birthDate: false,
                }));
                if (updatedDate && !isNaN(updatedDate.getTime())) {
                  setPatientFormData((prev) => ({
                    ...prev,
                    birthDate: updatedDate.toISOString(),
                  }));
                }
              }}
              onError={(error) => {
                if (error) {
                  setPatientValidation((prev) => ({
                    ...prev,
                    birthDate: true,
                  }));
                }
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
                error={patientValidation.phoneCountryCode}
              >
                {Object.keys(PHONE_COUNTRY_CODES).map((key) => (
                  <MenuItem key={key} value={key}>
                    {
                      PHONE_COUNTRY_CODES[
                        key as keyof typeof PHONE_COUNTRY_CODES
                      ]
                    }
                  </MenuItem>
                ))}
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
              error={patientValidation.phoneNumber}
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
                  setPatientValidation((prev) => ({
                    ...prev,
                    sex: false,
                  }));
                  setPatientFormData((prev) => ({
                    ...prev,
                    sex: value,
                  }));
                }}
                error={patientValidation.sex}
              >
                {Object.keys(SEX).map((key) => (
                  <MenuItem key={key} value={key}>
                    {SEX[key as keyof typeof SEX]}
                  </MenuItem>
                ))}
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
              error={patientValidation.placeOfWork}
            />
          </Grid>
          <Grid width={1}>
            <TextField
              fullWidth
              label="Посада"
              name="position"
              value={patientFormData.position}
              onChange={handleChangePatientData}
              error={patientValidation.position}
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
                  setPatientValidation((prev) => ({
                    ...prev,
                    clientType: false,
                  }));
                  setPatientFormData((prev) => ({
                    ...prev,
                    clientType: value,
                  }));
                }}
                error={patientValidation.clientType}
              >
                {Object.keys(PATIENTS_TYPES).map((key) => (
                  <MenuItem key={key} value={key}>
                    {PATIENTS_TYPES[key as keyof typeof PATIENTS_TYPES]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                  setPatientValidation((prev) => ({
                    ...prev,
                    filialId: false,
                  }));
                  setPatientFormData((prev) => ({
                    ...prev,
                    filialId: value,
                  }));
                }}
                error={patientValidation.filialId}
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
          display={"grid"}
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          spacing={1}
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
              patientFormData.regionOfBirth
                ? {
                    value: patientFormData.regionOfBirth,
                    label: REGIONS[patientFormData.regionOfBirth] || "",
                  }
                : null
            }
            onChange={(_, newValue) => {
              setPatientValidation((prev) => ({
                ...prev,
                regionOfBirth: false,
              }));
              setPatientFormData({
                ...patientFormData,
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
                  patientFormData.regionOfBirth
                    ? REGIONS[patientFormData.regionOfBirth] || ""
                    : ""
                }
                error={patientValidation.regionOfBirth}
              />
            )}
          />
          <Autocomplete
            freeSolo
            options={Object.keys(
              CITIES[patientFormData.regionOfBirth] || {}
            ).map((key) => ({
              value: key,
              label: CITIES[patientFormData.regionOfBirth][key],
            }))}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.label
            }
            value={
              patientFormData.cityOfBirth
                ? {
                    value: patientFormData.cityOfBirth,
                    label:
                      CITIES[patientFormData.regionOfBirth]?.[
                        patientFormData.cityOfBirth
                      ] || "",
                  }
                : null
            }
            onChange={(_, newValue) => {
              setPatientValidation((prev) => ({
                ...prev,
                cityOfBirth: false,
              }));
              setPatientFormData({
                ...patientFormData,
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
                error={patientValidation.cityOfBirth}
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
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          spacing={1}
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
              patientFormData.regionOfResidence
                ? {
                    value: patientFormData.regionOfResidence,
                    label: REGIONS[patientFormData.regionOfResidence] || "",
                  }
                : null
            }
            onChange={(_, newValue) => {
              setPatientValidation((prev) => ({
                ...prev,
                regionOfResidence: false,
              }));
              setPatientFormData({
                ...patientFormData,
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
                  patientFormData.regionOfResidence
                    ? REGIONS[patientFormData.regionOfResidence] || ""
                    : ""
                }
                error={patientValidation.regionOfResidence}
              />
            )}
          />
          <Autocomplete
            freeSolo
            options={Object.keys(
              CITIES[patientFormData.regionOfResidence] || {}
            ).map((key) => ({
              value: key,
              label: CITIES[patientFormData.regionOfResidence][key],
            }))}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.label
            }
            value={
              patientFormData.cityOfResidence
                ? {
                    value: patientFormData.cityOfResidence,
                    label:
                      CITIES[patientFormData.regionOfResidence]?.[
                        patientFormData.cityOfResidence
                      ] || "",
                  }
                : null
            }
            onChange={(_, newValue) => {
              setPatientValidation((prev) => ({
                ...prev,
                cityOfResidence: false,
              }));
              setPatientFormData({
                ...patientFormData,
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
                error={patientValidation.cityOfResidence}
              />
            )}
          />
          <Grid>
            <TextField
              fullWidth
              label="Введіть адресу"
              name="addressOfResidence"
              value={patientFormData.addressOfResidence || ""}
              onChange={(e) => {
                setPatientValidation((prev) => ({
                  ...prev,
                  addressOfResidence: false,
                }));
                setPatientFormData({
                  ...patientFormData,
                  addressOfResidence: e.target.value,
                });
              }}
              sx={{ mt: 2 }}
              error={patientValidation.addressOfResidence}
            />
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
              {Object.keys(PHONE_COUNTRY_CODES).map((key) => (
                <MenuItem key={key} value={key}>
                  {PHONE_COUNTRY_CODES[key as keyof typeof PHONE_COUNTRY_CODES]}
                </MenuItem>
              ))}
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
                sex: "",
                passportSeries: "",
                passportNumber: "",
                idCardNumber: "",
                placeOfWork: "",
                position: "",
                clientType: "",
                regionOfBirth: "",
                cityOfBirth: "",
                regionOfResidence: "",
                cityOfResidence: "",
                addressOfResidence: "",
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
              Редагування прийому
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
                        setValidation((prev) => ({
                          ...prev,
                          doctorId: false,
                        }));
                        setAppointmentFormData((prev) => ({
                          ...prev,
                          doctorId: value,
                        }));
                      }}
                      error={validation.doctorId}
                    >
                      {doctors.map((doctor: Doctor) => (
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
                        const priceItem =
                          SERVICE_PRICES[value as keyof typeof SERVICE_PRICES];
                        setValidation((prev) => ({
                          ...prev,
                          serviceType: false,
                        }));
                        setAppointmentFormData((prev) => ({
                          ...prev,
                          serviceType: value,
                          price: priceItem.value,
                        }));
                      }}
                      error={validation.serviceType}
                    >
                      {Object.keys(SERVICE_PRICES).map((key) => {
                        const serviceKey = key as keyof typeof SERVICE_PRICES;
                        return (
                          <MenuItem key={serviceKey} value={serviceKey}>
                            {SERVICE_PRICES[serviceKey].label}
                          </MenuItem>
                        );
                      })}
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
                        setValidation((prev) => ({
                          ...prev,
                          recordType: false,
                        }));
                        setAppointmentFormData((prev) => ({
                          ...prev,
                          recordType: value,
                        }));
                      }}
                      error={validation.recordType}
                    >
                      {Object.keys(RECORD_TYPES).map((key) => (
                        <MenuItem key={key} value={key}>
                          {RECORD_TYPES[key as keyof typeof RECORD_TYPES]}
                        </MenuItem>
                      ))}
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
                        setValidation((prev) => ({
                          ...prev,
                          sourceOfInfo: false,
                        }));
                        setAppointmentFormData((prev) => ({
                          ...prev,
                          sourceOfInfo: value,
                        }));
                      }}
                      error={validation.sourceOfInfo}
                    >
                      {Object.keys(SOURCE_OF_INFO).map((key) => (
                        <MenuItem key={key} value={key}>
                          {SOURCE_OF_INFO[key as keyof typeof SOURCE_OF_INFO]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid width={1}>
                  <TextField
                    disabled
                    fullWidth
                    label="Вартість"
                    name="price"
                    value={appointmentFormData.price}
                  />
                </Grid>
              </Grid>
            </Paper>

            {currentAppointment?.status === "canceled" && (
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
                      <InputLabel id="demo-simple-select-label">
                        Звітував
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={appointmentFormData.aReporterId}
                        label="Звітував"
                        onChange={(event) => {
                          const value = event.target.value;
                          setValidation((prev) => ({
                            ...prev,
                            aReporterId: false,
                          }));
                          setAppointmentFormData((prev) => ({
                            ...prev,
                            aReporterId: value,
                          }));
                        }}
                        error={validation.aReporterId}
                      >
                        {crmUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.lastName} {user.firstName} {user.middleName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid width={1}>
                    <TextField
                      fullWidth
                      label="Причина"
                      name="cancelReason"
                      value={appointmentFormData.cancelReason}
                      onInput={(event) => {
                        const value = (event.target as HTMLInputElement).value;
                        setAppointmentFormData((prev) => ({
                          ...prev,
                          cancelReason: value,
                        }));
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  display={"grid"}
                  gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                  spacing={1}
                  sx={{ mt: 2, textAlign: "left" }}
                >
                  <Grid width={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            appointmentFormData.consentForTreatment || false
                          }
                          onChange={(event) => {
                            setAppointmentFormData((prev) => ({
                              ...prev,
                              consentForTreatment: event.target.checked,
                            }));
                          }}
                        />
                      }
                      label="Згода на лікування"
                    />
                  </Grid>
                  <Grid width={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            appointmentFormData.consentForDataProcessing ||
                            false
                          }
                          onChange={(event) => {
                            setAppointmentFormData((prev) => ({
                              ...prev,
                              consentForDataProcessing: event.target.checked,
                            }));
                          }}
                        />
                      }
                      label="Згода на обробку даних"
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  sx={{ flex: "1 1 auto", minWidth: "120px", marginTop: 2 }}
                  onClick={handleToggleDeleteReport}
                >
                  Видалити звіт
                </Button>
                <Dialog
                  open={openDeleteReport}
                  onClose={handleToggleDeleteReport}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{`Бажаєте видатили звіт?`}</DialogTitle>
                  <DialogContent></DialogContent>
                  <DialogActions>
                    <Button onClick={handleToggleDeleteReport}>
                      Повернутись
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDeleteReport}
                      autoFocus
                    >
                      Видалити звіт
                    </Button>
                  </DialogActions>
                </Dialog>
              </Paper>
            )}

            {(currentAppointment?.status === "processing" ||
              currentAppointment?.status === "done") && (
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
                      <InputLabel id="demo-simple-select-label">
                        Звітував
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={appointmentFormData.aReporterId}
                        label="Звітував"
                        onChange={(event) => {
                          const value = event.target.value;
                          setValidation((prev) => ({
                            ...prev,
                            aReporterId: false,
                          }));
                          setAppointmentFormData((prev) => ({
                            ...prev,
                            aReporterId: value,
                          }));
                        }}
                        error={validation.aReporterId}
                      >
                        {crmUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.lastName} {user.firstName} {user.middleName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid width={1}>
                    <FormControl fullWidth>
                      <InputLabel id="payment-type-label">
                        Тип оплати
                      </InputLabel>
                      <Select
                        labelId="payment-type-label"
                        id="payment-type"
                        value={appointmentFormData.paymentType}
                        label="Тип оплати"
                        onChange={(event) => {
                          const value = event.target.value;
                          setAppointmentFormData((prev) => ({
                            ...prev,
                            paymentType: value,
                          }));
                        }}
                      >
                        {Object.keys(PAYMENT_TYPES).map((key) => (
                          <MenuItem key={key} value={key}>
                            {PAYMENT_TYPES[key as keyof typeof PAYMENT_TYPES]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  container
                  display={"grid"}
                  gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                  spacing={1}
                  sx={{ mt: 2, textAlign: "left" }}
                >
                  <Grid width={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            appointmentFormData.consentForTreatment || false
                          }
                          onChange={(event) => {
                            setAppointmentFormData((prev) => ({
                              ...prev,
                              consentForTreatment: event.target.checked,
                            }));
                          }}
                        />
                      }
                      label="Згода на лікування"
                    />
                  </Grid>
                  <Grid width={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            appointmentFormData.consentForDataProcessing ||
                            false
                          }
                          onChange={(event) => {
                            setAppointmentFormData((prev) => ({
                              ...prev,
                              consentForDataProcessing: event.target.checked,
                            }));
                          }}
                        />
                      }
                      label="Згода на обробку даних"
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  sx={{ flex: "1 1 auto", minWidth: "120px", marginTop: 2 }}
                  onClick={handleToggleDeleteReport}
                >
                  Видалити звіт
                </Button>
                <Dialog
                  open={openDeleteReport}
                  onClose={handleToggleDeleteReport}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{`Бажаєте видатили звіт?`}</DialogTitle>
                  <DialogContent></DialogContent>
                  <DialogActions>
                    <Button onClick={handleToggleDeleteReport}>
                      Повернутись
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDeleteReport}
                      autoFocus
                    >
                      Видалити звіт
                    </Button>
                  </DialogActions>
                </Dialog>
              </Paper>
            )}
            {currentAppointment?.status === "done" && (
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
                      <InputLabel id="demo-simple-select-label">
                        Додав діагноз
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={appointmentFormData.diagnosisAdderId}
                        label="Додав діагноз"
                        onChange={(event) => {
                          const value = event.target.value;
                          setValidation((prev) => ({
                            ...prev,
                            diagnosisAdderId: false,
                          }));
                          setAppointmentFormData((prev) => ({
                            ...prev,
                            diagnosisAdderId: value,
                          }));
                        }}
                        error={validation.diagnosisAdderId}
                      >
                        {crmUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.lastName} {user.firstName} {user.middleName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid width={1}>
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        label="Діагноз"
                        name="diagnosis"
                        value={appointmentFormData.diagnosis}
                        onInput={(event) => {
                          const value = (event.target as HTMLInputElement)
                            .value;
                          setAppointmentFormData((prev) => ({
                            ...prev,
                            diagnosis: value,
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  container
                  display={"grid"}
                  gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                  spacing={1}
                  sx={{ mt: 2, textAlign: "left" }}
                >
                  <Grid width={1}>
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        label="Рекомендації"
                        name="recommendations"
                        value={appointmentFormData.recommendations}
                        onInput={(event) => {
                          const value = (event.target as HTMLInputElement)
                            .value;
                          setAppointmentFormData((prev) => ({
                            ...prev,
                            recommendations: value,
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid width={1}>
                    <FormControl fullWidth>
                      <TextField
                        fullWidth
                        label="Коментар"
                        name="comment"
                        value={appointmentFormData.comment}
                        onInput={(event) => {
                          const value = (event.target as HTMLInputElement)
                            .value;
                          setAppointmentFormData((prev) => ({
                            ...prev,
                            comment: value,
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  sx={{ flex: "1 1 auto", minWidth: "120px", marginTop: 2 }}
                  onClick={handleToggleDeleteDiagnosis}
                >
                  Видалити діагноз
                </Button>
                <Dialog
                  open={openDeleteDiagnosis}
                  onClose={handleToggleDeleteDiagnosis}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{`Бажаєте видатили діагноз?`}</DialogTitle>
                  <DialogContent></DialogContent>
                  <DialogActions>
                    <Button onClick={handleToggleDeleteDiagnosis}>
                      Повернутись
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDeleteDiagnosis}
                      autoFocus
                    >
                      Видалити діагноз
                    </Button>
                  </DialogActions>
                </Dialog>
              </Paper>
            )}
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

export default EditAppointment;

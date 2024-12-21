import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import useFetchPrivate from "../../../../hooks/useFetchPrivate";
import { updateAppointment } from "../../../../store/features/appointments/appointmentsSlice";
import { useAppDispatch } from "../../../../hooks";
import useMessage from "../../../../hooks/useMessage";
import useLoading from "../../../../hooks/useLoading";
import useAuth from "../../../../hooks/useAuth";

const DiagnosisModal = ({ appointment }: { appointment: Appointment }) => {
  const dispatch = useAppDispatch();
  const fetchPrivate = useFetchPrivate();
  const showMessage = useMessage();
  const { startLoading, stopLoading } = useLoading();
  const { auth } = useAuth();
  const [openReport, setOpenReport] = useState(false);
  const [formData, setFormData] = useState({
    appointmentId: appointment.id,
    diagnosisAdderId: auth?.id,
    diagnosis: "",
    recommendations: "",
    comment: "",
  });
  const [formDataValidation, setFormDataValidation] = useState({
    diagnosis: false,
    recommendations: false,
    comment: false,
  });

  const handleClickReport = () => setOpenReport((prev) => !prev);

  const handleSubmit = async () => {
    startLoading();
    type ReportFormData = {
      appointmentId: number;
      diagnosisAdderId: number;
      diagnosis: string;
      recommendations: string;
      comment: string;
    };
    const body: ReportFormData = {
      appointmentId: formData.appointmentId,
      diagnosisAdderId: formData.diagnosisAdderId,
      diagnosis: formData.diagnosis,
      recommendations: formData.recommendations,
      comment: formData.comment,
    };

    if (formData.diagnosis === "") {
      setFormDataValidation({
        ...formDataValidation,
        diagnosis: true,
      });
      showMessage({
        title: "Помилка!",
        text: "Вкажіть діагноз.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (formData.recommendations === "") {
      setFormDataValidation({
        ...formDataValidation,
        recommendations: true,
      });
      showMessage({
        title: "Помилка!",
        text: "Вкажіть рекомендації.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (formData.comment === "") {
      setFormDataValidation({
        ...formDataValidation,
        comment: true,
      });
      showMessage({
        title: "Помилка!",
        text: "Вкажіть коментар.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    const { data, error } = await fetchPrivate("appointments/add-diagnosis", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    if (error) {
      showMessage({
        title: "Помилка!",
        text: "Не вдалось додати діагноз.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    const updatedAppointment = {
      ...data.appointment,
      patientFirstName: appointment.patientFirstName,
      patientLastName: appointment.patientLastName,
      patientMiddleName: appointment.patientMiddleName,
    };
    dispatch(updateAppointment(updatedAppointment));
    setOpenReport(false);
    showMessage({
      title: "Успіх!",
      text: "Діагноз додано.",
      severity: "success",
    });
    stopLoading();
  };
  return (
    <ListItem
      sx={{
        pl: 9,
        flexWrap: "wrap",
        justifyContent: "center",
        display: "grid",
        gridTemplateColumns: "1fr",
      }}
    >
      <Button
        startIcon={<LocalHospitalIcon />}
        variant="contained"
        color="primary"
        onClick={handleClickReport}
      >
        Додати діагноз
      </Button>
      <Dialog
        open={openReport}
        onClose={handleClickReport}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Додайте інформацію про діагноз"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl sx={{ paddingTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Діагноз"
              variant="outlined"
              value={formData.diagnosis}
              onChange={(e) => {
                setFormDataValidation({
                  ...formDataValidation,
                  diagnosis: false,
                });
                setFormData({
                  ...formData,
                  diagnosis: (e.target as HTMLInputElement).value,
                });
              }}
              error={formDataValidation.diagnosis}
            />
          </FormControl>
          <FormControl sx={{ paddingTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Рекомендації"
              variant="outlined"
              value={formData.recommendations}
              onChange={(e) => {
                setFormDataValidation({
                  ...formDataValidation,
                  recommendations: false,
                });
                setFormData({
                  ...formData,
                  recommendations: (e.target as HTMLInputElement).value,
                });
              }}
              error={formDataValidation.recommendations}
            />
          </FormControl>
          <FormControl sx={{ paddingTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Коментар"
              variant="outlined"
              value={formData.comment}
              onChange={(e) => {
                setFormDataValidation({
                  ...formDataValidation,
                  comment: false,
                });
                setFormData({
                  ...formData,
                  comment: (e.target as HTMLInputElement).value,
                });
              }}
              error={formDataValidation.comment}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickReport}>Відміна</Button>
          <Button variant="contained" onClick={handleSubmit} autoFocus>
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
};

export default DiagnosisModal;

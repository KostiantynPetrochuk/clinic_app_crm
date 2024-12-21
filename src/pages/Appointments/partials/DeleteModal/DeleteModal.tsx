import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import useFetchPrivate from "../../../../hooks/useFetchPrivate";
import { updateAppointment } from "../../../../store/features/appointments/appointmentsSlice";
import { useAppDispatch } from "../../../../hooks";
import useMessage from "../../../../hooks/useMessage";
import useLoading from "../../../../hooks/useLoading";
import { APP_ROUTES } from "../../../../constants";

const DeleteModal = ({ appointment }: { appointment: Appointment }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const showMessage = useMessage();
  const fetchPrivate = useFetchPrivate();
  const { startLoading, stopLoading } = useLoading();
  const [openReport, setOpenReport] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteReasonValidation, setDeleteReasonValidation] = useState(false);

  const handleClickReport = () => setOpenReport((prev) => !prev);

  const handleSubmit = async () => {
    startLoading();
    const deleteReasonValue = deleteReason.trim();
    if (!deleteReasonValue.length) {
      setDeleteReasonValidation(true);
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть причину видалення.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    if (deleteReasonValue.length < 5) {
      setDeleteReasonValidation(true);
      showMessage({
        title: "Помилка!",
        text: "Будь ласка, вкажіть причину видалення більше ніж 5 символів.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    const body = {
      deleteReason: deleteReasonValue,
    };
    const { data, error } = await fetchPrivate(
      `appointments/${appointment.id}`,
      {
        method: "DELETE",
        body: JSON.stringify(body),
      }
    );
    if (error) {
      showMessage({
        title: "Помилка!",
        text: "Не вдалось видалити прийом.",
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
    showMessage({
      title: "Успіх!",
      text: "Запис видалено.",
      severity: "success",
    });
    stopLoading();
  };
  return (
    <ListItem
      sx={{
        display: "grid",
        pl: 9,
        flexWrap: "wrap",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "0.5fr 0.5fr",
        },
        gridGap: 10,
      }}
    >
      <Button
        startIcon={<EditIcon />}
        variant="contained"
        color="warning"
        onClick={() => {
          navigate(APP_ROUTES.EDIT_APPOINTMENT + "/" + appointment.id);
        }}
      >
        Редагувати
      </Button>
      <Button
        startIcon={<DeleteIcon />}
        variant="contained"
        color="error"
        onClick={handleClickReport}
      >
        Видалити
      </Button>
      <Dialog
        open={openReport}
        onClose={handleClickReport}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Бажаєте видалити запис?"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Причина скасування"
            variant="outlined"
            sx={{ mb: 2, marginTop: 2 }}
            value={deleteReason}
            onInput={(e) => {
              const value = (e.target as HTMLInputElement).value;
              setDeleteReason(value);
              setDeleteReasonValidation(false);
            }}
            error={deleteReasonValidation}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickReport}>Відміна</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            autoFocus
          >
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
};

export default DeleteModal;

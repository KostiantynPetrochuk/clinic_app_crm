import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ListItem from "@mui/material/ListItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import useFetchPrivate from "../../../../hooks/useFetchPrivate";
import { updateAppointment } from "../../../../store/features/appointments/appointmentsSlice";
import { useAppDispatch } from "../../../../hooks";
import useMessage from "../../../../hooks/useMessage";
import useLoading from "../../../../hooks/useLoading";

const ReportModal = ({ appointment }: { appointment: Appointment }) => {
  const dispatch = useAppDispatch();
  const showMessage = useMessage();
  const fetchPrivate = useFetchPrivate();
  const { startLoading, stopLoading } = useLoading();
  const [openReport, setOpenReport] = useState(false);
  const [formData, setFormData] = useState({
    appointmentId: appointment.id,
    status: "processing", // new, processing, done, canceled
    paymentType: "cash", // cash, terminal
    consentForTreatment: appointment.consentForTreatment || false,
    consentForDataProcessing: appointment.consentForDataProcessing || false,
    cancelReason: appointment.cancelReason.String || "",
  });
  const [formDataValidation, setFormDataValidation] = useState({
    cancelReason: false,
  });

  const handleClickReport = () => setOpenReport((prev) => !prev);

  const handleSubmit = async () => {
    startLoading();
    type ReportFormData = {
      appointmentId: number;
      status: string;
      paymentType?: string;
      consentForTreatment?: boolean;
      consentForDataProcessing?: boolean;
      cancelReason?: string;
    };
    const body: ReportFormData = {
      appointmentId: formData.appointmentId,
      status: formData.status,
    };

    if (formData.status === "processing") {
      body["paymentType"] = formData.paymentType;
      body["consentForTreatment"] = formData.consentForTreatment;
      body["consentForDataProcessing"] = formData.consentForDataProcessing;
    }
    if (formData.status === "canceled") {
      body["cancelReason"] = formData.cancelReason;
    }
    if (formData.status === "canceled" && formData.cancelReason === "") {
      setFormDataValidation({
        ...formDataValidation,
        cancelReason: true,
      });
      showMessage({
        title: "Помилка!",
        text: "Вкажіть причину скасування.",
        severity: "error",
      });
      stopLoading();
      return;
    }
    const { data, error } = await fetchPrivate("appointments/report", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    if (error) {
      showMessage({
        title: "Помилка!",
        text: "Не вдалось відправити звіт.",
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
      text: "Звіт відправлено.",
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
      }}
    >
      <Button
        startIcon={<FactCheckIcon />}
        variant="contained"
        color="primary"
        onClick={handleClickReport}
      >
        Звітувати
      </Button>
      <Dialog
        open={openReport}
        onClose={handleClickReport}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Вкажіть, чи відбувся прийом"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="processing"
                control={<Radio />}
                label="Відбувся"
                checked={formData.status === "processing"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: (e.target as HTMLInputElement).value,
                  })
                }
              />
              <FormControlLabel
                value="canceled"
                control={<Radio />}
                label="Не відбувся"
                checked={formData.status === "canceled"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: (e.target as HTMLInputElement).value,
                  })
                }
              />
            </RadioGroup>
          </FormControl>
          {formData.status === "processing" && (
            <>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Тип оплати
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="cash"
                    control={<Radio />}
                    label="Готівка"
                    checked={formData.paymentType === "cash"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentType: (e.target as HTMLInputElement).value,
                      })
                    }
                  />
                  <FormControlLabel
                    value="terminal"
                    control={<Radio />}
                    label="Термінал"
                    checked={formData.paymentType === "terminal"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentType: (e.target as HTMLInputElement).value,
                      })
                    }
                  />
                </RadioGroup>
              </FormControl>
              <FormControlLabel
                control={<Checkbox />}
                label="Погодження на лікування"
                checked={formData.consentForTreatment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consentForTreatment: (e.target as HTMLInputElement).checked,
                  })
                }
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Погодження на обробку даних"
                checked={formData.consentForDataProcessing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consentForDataProcessing: (e.target as HTMLInputElement)
                      .checked,
                  })
                }
              />
            </>
          )}
          {formData.status === "canceled" && (
            <TextField
              id="outlined-basic"
              label="Причина скасування"
              variant="outlined"
              value={formData.cancelReason}
              onChange={(e) => {
                setFormDataValidation({
                  ...formDataValidation,
                  cancelReason: false,
                });
                setFormData({
                  ...formData,
                  cancelReason: (e.target as HTMLInputElement).value,
                });
              }}
              error={formDataValidation.cancelReason}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickReport}>Відміна</Button>
          <Button variant="contained" onClick={handleSubmit} autoFocus>
            Записати
          </Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
};

export default ReportModal;

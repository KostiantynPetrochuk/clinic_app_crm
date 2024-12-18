import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Badge from "@mui/material/Badge";
import { red } from "@mui/material/colors";
import { format, parseISO } from "date-fns";
import { useAppSelector } from "../../../../hooks";
import { selectDoctors } from "../../../../store/features/doctors/doctorsSlice";
import { selectFilials } from "../../../../store/features/filials/filialsSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  ReportModal,
  ProcessingStatus,
  CancelStatus,
  DiagnosisModal,
  SuccessStatus,
} from "..";

import { Grid2 as Grid } from "@mui/material";
import {
  SERVICE_TYPES,
  RECORD_TYPES,
  SOURCE_OF_INFO,
} from "../../../../constants";
import DeleteModal from "../DeleteModal";
import DeleteStatus from "../DeleteStatus";

type Badge = {
  content: string;
  color: "primary" | "secondary" | "error" | "info" | "success" | "warning";
};

const AppointmentItem = ({ appointment }: { appointment: Appointment }) => {
  const [open, setOpen] = useState(false);
  const filials = useAppSelector(selectFilials);
  const doctors = useAppSelector(selectDoctors);
  const handleClick = () => setOpen(!open);
  const currentFilial = filials.find(
    (filial: Filial) => filial.id === appointment.filialId
  );
  const currentDoctor = doctors.find(
    (doctor: Doctor) => doctor.id === appointment.doctorId
  );
  let consernForTreatmentContent = (
    <Grid display={"flex"}>
      <Typography sx={{ marginRight: 1 }}>Погодження на лікування:</Typography>
      {appointment.consentForTreatment ? (
        <CheckCircleIcon color="success" />
      ) : (
        <CancelIcon color="error" />
      )}
    </Grid>
  );
  let consernForDataProcessingContent = (
    <Grid display={"flex"}>
      <Typography sx={{ marginRight: 1 }}>
        Погодження на обробку даних:
      </Typography>
      {appointment.consentForDataProcessing ? (
        <CheckCircleIcon color="success" />
      ) : (
        <CancelIcon color="error" />
      )}
    </Grid>
  );
  let badgeContent = "Новий запис";
  let badgeColor: Badge["color"] = "primary";
  if (appointment.status === "processing") {
    badgeContent = "В обробці";
    badgeColor = "warning";
  }
  if (appointment.status === "done") {
    badgeContent = "Відбувся";
    badgeColor = "success";
  }
  if (appointment.status === "canceled") {
    badgeContent = "Скасовано";
    badgeColor = "error";
  }
  if (appointment.status === "deleted") {
    badgeContent = "Видалено";
    badgeColor = "secondary";
  }
  const itemColor = appointment.status === "deleted" ? red[100] : "white";

  return (
    <Paper
      key={appointment.id}
      sx={{
        padding: 2,
        textAlign: "center",
        marginTop: 2,
        width: "100%",
        backgroundColor: itemColor,
      }}
      elevation={24}
    >
      <Badge
        sx={{ width: "100%" }}
        badgeContent={badgeContent}
        color={badgeColor}
      >
        <List key={appointment.id} sx={{ width: "100%" }}>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>{appointment.id}</ListItemIcon>
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1.45fr 0.55fr",
                },
              }}
            >
              <ListItemText
                sx={{ marginRight: 2, flexGrow: 10 }}
                primary={`${appointment?.patientLastName} ${appointment?.patientFirstName} ${appointment?.patientMiddleName}`}
                secondary={`${currentFilial?.city}`}
              />
              <ListItemText
                sx={{ marginRight: 2 }}
                primary={format(
                  parseISO(appointment.startDateTime),
                  "dd.MM.yyyy"
                )}
                secondary={
                  format(parseISO(appointment.startDateTime), "HH:mm") +
                  " - " +
                  format(parseISO(appointment.endDateTime), "HH:mm")
                }
              />
            </Box>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                sx={{
                  pl: 9,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1.4fr 0.6fr",
                  },
                }}
              >
                <ListItemText
                  sx={{ marginRight: 2, flexGrow: 10 }}
                  primary={"Лікар"}
                  secondary={`${currentDoctor?.lastName} ${currentDoctor?.firstName} ${currentDoctor?.middleName}`}
                />
                <ListItemText
                  sx={{ marginRight: 4 }}
                  primary={"Тип послуги"}
                  secondary={
                    SERVICE_TYPES[
                      appointment?.serviceType as keyof typeof SERVICE_TYPES
                    ]
                  }
                />
              </ListItem>
              <ListItem
                sx={{
                  pl: 9,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1.4fr 0.6fr",
                  },
                }}
              >
                <ListItemText
                  sx={{ marginRight: 2, flexGrow: 10 }}
                  primary={"Тип запису"}
                  secondary={
                    RECORD_TYPES[
                      appointment?.recordType as keyof typeof RECORD_TYPES
                    ]
                  }
                />
                <ListItemText
                  sx={{ marginRight: 3 }}
                  primary={"Як дізнались"}
                  secondary={
                    SOURCE_OF_INFO[
                      appointment?.sourceOfInfo as keyof typeof SOURCE_OF_INFO
                    ]
                  }
                />
              </ListItem>
              <ListItem
                sx={{
                  pl: 9,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1.4fr 0.6fr",
                  },
                }}
              >
                <ListItemText
                  sx={{ marginRight: 2, flexGrow: 10 }}
                  primary={"Ціна"}
                  secondary={appointment?.price}
                />
              </ListItem>
              <ListItem
                sx={{
                  pl: 9,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1.4fr 0.6fr",
                  },
                }}
              >
                <ListItemText
                  sx={{ marginRight: 2, flexGrow: 10 }}
                  primary={consernForTreatmentContent}
                />
                <ListItemText
                  sx={{ marginRight: 2 }}
                  primary={consernForDataProcessingContent}
                />
              </ListItem>
              {appointment?.status === "new" && (
                <ReportModal appointment={appointment} />
              )}
              {(appointment?.status === "processing" ||
                appointment?.status === "done") && (
                <ProcessingStatus appointment={appointment} />
              )}
              {appointment?.status === "canceled" && (
                <CancelStatus appointment={appointment} />
              )}
              {appointment?.status === "processing" && (
                <DiagnosisModal appointment={appointment} />
              )}
              {appointment?.status === "done" && (
                <SuccessStatus appointment={appointment} />
              )}
              {appointment?.status !== "deleted" && (
                <DeleteModal appointment={appointment} />
              )}
              {appointment?.status === "deleted" && (
                <DeleteStatus appointment={appointment} />
              )}
            </List>
          </Collapse>
        </List>
      </Badge>
    </Paper>
  );
};

export default AppointmentItem;

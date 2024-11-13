import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
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
import { format, parseISO } from "date-fns";
import { useAppSelector } from "../../hooks";
import { selectAppointments } from "../../store/features/appointments/appointmentsSlice";
import { selectFilials } from "../../store/features/filials/filialsSlice";
import { selectDoctors } from "../../store/features/doctors/doctorsSlice";
import CancelIcon from "@mui/icons-material/Cancel";
import { Grid2 as Grid } from "@mui/material";
import { SERVICE_TYPES, RECORD_TYPES, SOURCE_OF_INFO } from "../../constants";

type Badge = {
  content: string;
  color: "primary" | "secondary" | "error" | "info" | "success" | "warning";
};

const Appointments = () => {
  const applications = useAppSelector(selectAppointments);
  const doctors = useAppSelector(selectDoctors);
  const filials = useAppSelector(selectFilials);
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(!open);

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
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 10,
              padding: 2,
            }}
          >
            {applications.map((application) => {
              const currentFilial = filials.find(
                (filial) => filial.id === application.filialId
              );
              const currentDoctor = doctors.find(
                (doctor) => doctor.id === application.doctorId
              );
              let consernForTreatmentContent = (
                <Grid display={"flex"}>
                  <Typography sx={{ marginRight: 1 }}>
                    Погодження на лікування:
                  </Typography>
                  <CancelIcon color="error" />
                </Grid>
              );
              let consernForDataProcessingContent = (
                <Grid display={"flex"}>
                  <Typography sx={{ marginRight: 1 }}>
                    Погодження на обробку даних:
                  </Typography>
                  <CheckCircleIcon color="success" />
                </Grid>
              );
              return (
                <Paper
                  key={application.id}
                  sx={{
                    padding: 2,
                    textAlign: "center",
                    marginTop: 2,
                    width: "100%",
                  }}
                  elevation={24}
                >
                  <Badge
                    sx={{ width: "100%" }}
                    badgeContent={"Запис на прийом"}
                    color={"primary"}
                  >
                    <List key={application.id} sx={{ width: "100%" }}>
                      <ListItemButton onClick={handleClick}>
                        <ListItemIcon>{application.id}</ListItemIcon>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            width: "100%",
                          }}
                        >
                          <ListItemText
                            sx={{ marginRight: 2, flexGrow: 10 }}
                            primary={`${application?.patientLastName} ${application?.patientFirstName} ${application?.patientMiddleName}`}
                            secondary={`${currentFilial?.city}`}
                          />
                          <ListItemText
                            sx={{ marginRight: 2 }}
                            primary={format(
                              parseISO(application.startDateTime),
                              "dd.MM.yyyy"
                            )}
                            secondary={
                              format(
                                parseISO(application.startDateTime),
                                "HH:mm"
                              ) +
                              " - " +
                              format(parseISO(application.endDateTime), "HH:mm")
                            }
                          />
                        </Box>
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItem sx={{ pl: 9, flexWrap: "wrap" }}>
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
                                  application?.serviceType as keyof typeof SERVICE_TYPES
                                ]
                              }
                            />
                          </ListItem>
                          <ListItem sx={{ pl: 9, flexWrap: "wrap" }}>
                            <ListItemText
                              sx={{ marginRight: 2, flexGrow: 10 }}
                              primary={"Тип запису"}
                              secondary={
                                RECORD_TYPES[
                                  application?.recordType as keyof typeof RECORD_TYPES
                                ]
                              }
                            />
                            <ListItemText
                              sx={{ marginRight: 3 }}
                              primary={"Як дізнались"}
                              secondary={
                                SOURCE_OF_INFO[
                                  application?.sourceOfInfo as keyof typeof SOURCE_OF_INFO
                                ]
                              }
                            />
                          </ListItem>
                          <ListItem sx={{ pl: 9, flexWrap: "wrap" }}>
                            <ListItemText
                              sx={{ marginRight: 2, flexGrow: 10 }}
                              primary={"Ціна"}
                              secondary={application?.price}
                            />
                          </ListItem>
                          <ListItem sx={{ pl: 9, flexWrap: "wrap" }}>
                            <ListItemText
                              sx={{ marginRight: 2, flexGrow: 10 }}
                              primary={consernForTreatmentContent}
                            />
                            <ListItemText
                              sx={{ marginRight: 2 }}
                              primary={consernForDataProcessingContent}
                            />
                          </ListItem>
                        </List>
                      </Collapse>
                    </List>
                  </Badge>
                </Paper>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Appointments;

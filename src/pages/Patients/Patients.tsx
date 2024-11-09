import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { APP_ROUTES } from "../../constants";
import { useAppSelector } from "../../hooks";
import { selectPatients } from "../../store/features/patients/patientsSlice";
import { selectFilials } from "../../store/features/filials/filialsSlice";

const Patients = () => {
  const patients = useAppSelector(selectPatients);
  const filials = useAppSelector(selectFilials);

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
              Пацієнти
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
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                marginTop: 2,
              }}
              elevation={24}
            >
              {patients.map((patient) => {
                const filial = filials.find((f) => f.id === patient.filialId);
                return (
                  <List key={patient.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        component={Link}
                        to={`${APP_ROUTES.PATIENTS}/${patient.id}`}
                      >
                        <ListItemIcon>{patient.id}</ListItemIcon>
                        <ListItemText
                          primary={`${patient.lastName} ${patient.firstName} ${patient.middleName}`}
                          secondary={filial?.city}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                );
              })}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Patients;

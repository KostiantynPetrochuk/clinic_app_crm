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
import { selectDoctors } from "../../store/features/doctors/doctorsSlice";
import { selectFilials } from "../../store/features/filials/filialsSlice";

const Doctors = () => {
  const doctors = useAppSelector(selectDoctors);
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
              Лікарі
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
              {doctors.map((doctor) => {
                const filial = filials.find((f) => f.id === doctor.filialId);

                return (
                  <List key={doctor.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        component={Link}
                        to={`${APP_ROUTES.DOCTORS}/${doctor.id}`}
                      >
                        <ListItemIcon>{doctor.id}</ListItemIcon>
                        <ListItemText
                          primary={`${doctor.lastName} ${doctor.firstName} ${doctor.middleName}`}
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

export default Doctors;

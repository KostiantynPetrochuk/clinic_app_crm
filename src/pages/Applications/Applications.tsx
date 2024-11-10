import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAppSelector } from "../../hooks";
import { selectApplications } from "../../store/features/applications/applicationsSlice";
import { ApplicationItem } from "./partials";

const Applications = () => {
  const applications = useAppSelector(selectApplications);
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
              Записи
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
            {applications.map((application) => (
              <ApplicationItem key={application.id} application={application} />
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Applications;

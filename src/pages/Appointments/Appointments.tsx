import { useEffect } from "react";
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

const Appointments = () => {
  const dispatch = useAppDispatch();
  const fetchPrivate = useFetchPrivate();
  const { startLoading, stopLoading } = useLoading();
  const showMessage = useMessage();
  const appointments = useAppSelector(selectAppointments);

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const { data, error } = await fetchPrivate("appointments");
        if (error) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати користувачів.",
            severity: "error",
          });
          return;
        }
        dispatch(setAppointments(data));
      } catch (error) {
        showMessage({
          title: "Помилка!",
          text: "Не вдалось отримати користувачів.",
          severity: "error",
        });
      } finally {
        stopLoading();
      }
    };
    fetchData();
  }, []);

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

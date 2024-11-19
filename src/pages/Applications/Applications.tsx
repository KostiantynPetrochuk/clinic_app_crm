import { useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectApplications } from "../../store/features/applications/applicationsSlice";
import { ApplicationItem } from "./partials";
import useLoading from "../../hooks/useLoading";
import useMessage from "../../hooks/useMessage";
import useFetchPrivate from "../../hooks/useFetchPrivate";
import { setApplications } from "../../store/features/applications/applicationsSlice";

const Applications = () => {
  const dispatch = useAppDispatch();
  const { startLoading, stopLoading } = useLoading();
  const showMessage = useMessage();
  const fetchPrivate = useFetchPrivate();
  const applications = useAppSelector(selectApplications);
  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const { data, error } = await fetchPrivate("applications");
        if (error) {
          showMessage({
            title: "Помилка!",
            text: "Не вдалось отримати користувачів.",
            severity: "error",
          });
          return;
        }
        dispatch(setApplications(data));
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

import { useEffect, useState } from "react";
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
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { selectFilials } from "../../store/features/filials/filialsSlice";
import Switch from "@mui/material/Switch";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { selectCrmUsers } from "../../store/features/crmUsers/crmUsersSlice";

const Applications = () => {
  const dispatch = useAppDispatch();
  const { startLoading, stopLoading } = useLoading();
  const showMessage = useMessage();
  const fetchPrivate = useFetchPrivate();
  const filials = useAppSelector(selectFilials);
  const crmUsers = useAppSelector(selectCrmUsers);
  const applications = useAppSelector(selectApplications);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>("new");
  const [selectedFilial, setSelectedFilial] = useState<number>(1);
  const [canceledByUser, setCanceledByUser] = useState<number | string>("");
  const [getAll, setGetAll] = useState<boolean>(true);

  const handleChangeDate = (date: Date) => setSelectedDate(date);

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      const dateString = selectedDate.toISOString();
      const params = new URLSearchParams({
        date: dateString,
        status: selectedStatus,
        filialId: selectedFilial.toString(),
        canceledByUser: canceledByUser.toString() || "0",
        getAll: getAll.toString(),
      });
      const url = `applications?${params.toString()}`;
      try {
        const { data, error } = await fetchPrivate(url);
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
  }, [selectedDate, selectedStatus, selectedFilial, canceledByUser, getAll]);

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
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              marginTop: 2,
              width: "100%",
            }}
            elevation={24}
          >
            <DateCalendar
              disabled={getAll}
              value={selectedDate}
              showDaysOutsideCurrentMonth
              fixedWeekNumber={6}
              onChange={handleChangeDate}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={getAll}
                  onChange={(event: any) => setGetAll(event.target.checked)}
                  name="getAll"
                  color="primary"
                />
              }
              label="Переглянути всі"
            />
          </Paper>
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              marginTop: 2,
              width: "100%",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 0.4fr",
              },
              gap: 2,
            }}
            elevation={24}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Філія</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFilial}
                label="Філія"
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedFilial(Number(value));
                }}
              >
                {filials.map((filial) => (
                  <MenuItem key={filial.id} value={filial.id}>
                    {filial.city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Скасував</InputLabel>
              <Select
                disabled={selectedStatus != "canceled" && canceledByUser === ""}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={canceledByUser}
                label="Скасував"
                onChange={(event) => {
                  const value = event.target.value;
                  setCanceledByUser(Number(value));
                }}
              >
                {crmUsers.map((crmUser) => (
                  <MenuItem key={crmUser.id} value={crmUser.id}>
                    {crmUser.lastName} {crmUser.firstName} {crmUser.middleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Статус</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="new"
                  control={<Radio checked={selectedStatus === "new"} />}
                  label="Новий"
                  onChange={() => {
                    setCanceledByUser("");
                    setSelectedStatus("new");
                  }}
                />
                <FormControlLabel
                  value="approved"
                  control={<Radio checked={selectedStatus === "approved"} />}
                  label="Підтверджений"
                  onChange={() => {
                    setCanceledByUser("");
                    setSelectedStatus("approved");
                    setGetAll(false);
                  }}
                />
                <FormControlLabel
                  value="canceled"
                  control={<Radio checked={selectedStatus === "canceled"} />}
                  label="Скасований"
                  onChange={() => {
                    setGetAll(false);
                    setSelectedStatus("canceled");
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Paper>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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

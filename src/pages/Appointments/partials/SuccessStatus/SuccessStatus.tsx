import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useAppSelector } from "../../../../hooks";
import { selectCrmUsers } from "../../../../store/features/crmUsers/crmUsersSlice";

const SuccessStatus = ({ appointment }: { appointment: Appointment }) => {
  const crmUsers = useAppSelector(selectCrmUsers);
  const diagnosisAdder = crmUsers.find(
    (user) => user.id === appointment.diagnosisAdderId.Int64
  );

  return (
    <>
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
          primary={"Додав діагноз"}
          secondary={`${diagnosisAdder?.firstName} ${diagnosisAdder?.lastName} ${diagnosisAdder?.middleName}`}
        />
        <ListItemText
          sx={{ marginRight: 4 }}
          primary={"Діагноз"}
          secondary={appointment.diagnosis.String}
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
          primary={"Рекомендації"}
          secondary={appointment.recommendations.String}
        />
        <ListItemText
          sx={{ marginRight: 4 }}
          primary={"Коментар"}
          secondary={appointment.comment.String}
        />
      </ListItem>
    </>
  );
};

export default SuccessStatus;

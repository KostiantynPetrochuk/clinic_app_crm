import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useAppSelector } from "../../../../hooks";
import { selectCrmUsers } from "../../../../store/features/crmUsers/crmUsersSlice";

const CancelStatus = ({ appointment }: { appointment: Appointment }) => {
  const crmUsers = useAppSelector(selectCrmUsers);
  const reporter = crmUsers.find(
    (user) => user.id === appointment.aReporterId.Int64
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
          primary={"Статус"}
          secondary={"Не відбувся"}
        />
        <ListItemText
          sx={{ marginRight: 2, flexGrow: 10 }}
          primary={"Звітував"}
          secondary={`${reporter?.firstName} ${reporter?.lastName} ${reporter?.middleName}`}
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
          primary={"Причина скасування"}
          secondary={appointment.cancelReason.String}
        />
      </ListItem>
    </>
  );
};

export default CancelStatus;

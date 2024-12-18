import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useAppSelector } from "../../../../hooks";
import { selectCrmUsers } from "../../../../store/features/crmUsers/crmUsersSlice";
import { parseISO, format } from "date-fns";

const DeleteStatus = ({ appointment }: { appointment: Appointment }) => {
  const crmUsers = useAppSelector(selectCrmUsers);
  const deletedBy = crmUsers.find(
    (user) => user.id === appointment.deletedBy.Int64
  );
  const deletedDate = format(
    parseISO(appointment.deletedAt.Time),
    "dd.MM.yyyy HH:mm"
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
          primary={"Видалив"}
          secondary={`${deletedBy?.lastName} ${deletedBy?.firstName} ${deletedBy?.middleName}`}
        />
        <ListItemText
          sx={{ marginRight: 4 }}
          primary={"Дата видалення"}
          secondary={deletedDate}
        />
      </ListItem>
      <ListItem
        sx={{
          pl: 9,
          display: "grid",
          gridTemplateColumns: "1fr",
        }}
      >
        <ListItemText
          sx={{ marginRight: 2, flexGrow: 10 }}
          primary={"Причина видалення"}
          secondary={appointment.deleteReason.String}
        />
      </ListItem>
    </>
  );
};

export default DeleteStatus;

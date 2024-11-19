import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useAppSelector } from "../../../../hooks";
import { selectCrmUsers } from "../../../../store/features/crmUsers/crmUsersSlice";

const ProcessingStatus = ({ appointment }: { appointment: Appointment }) => {
  const crmUsers = useAppSelector(selectCrmUsers);
  let paymentType;
  if (appointment?.paymentType?.String === "cash") {
    paymentType = "Готівка";
  } else if (appointment?.paymentType?.String === "terminal") {
    paymentType = "Термінал";
  }
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
          secondary={"Відбувся"}
        />
        <ListItemText
          sx={{ marginRight: 4 }}
          primary={"Тип оплати"}
          secondary={paymentType}
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
          primary={"Звітував"}
          secondary={`${reporter?.firstName} ${reporter?.lastName} ${reporter?.middleName}`}
        />
      </ListItem>
    </>
  );
};

export default ProcessingStatus;

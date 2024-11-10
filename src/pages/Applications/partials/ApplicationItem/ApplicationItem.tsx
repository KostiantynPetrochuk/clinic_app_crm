import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import Badge from "@mui/material/Badge";
import { format, parseISO } from "date-fns";
import { useAppSelector } from "../../../../hooks";
import { selectPatients } from "../../../../store/features/patients/patientsSlice";
import { selectFilials } from "../../../../store/features/filials/filialsSlice";
import { selectCrmUsers } from "../../../../store/features/crmUsers/crmUsersSlice";
import { CancelButton } from "../";

import Button from "@mui/material/Button";

type Badge = {
  content: string;
  color: "primary" | "secondary" | "error" | "info" | "success" | "warning";
};

type ApplicationItemProps = {
  application: Application;
};

const ApplicationItem = ({ application }: ApplicationItemProps) => {
  const patients = useAppSelector(selectPatients);
  const filials = useAppSelector(selectFilials);
  const crmUsers = useAppSelector(selectCrmUsers);
  const patient = patients.find((p) => p.id === application.patientId);
  const filial = filials.find((f) => f.id === patient?.filialId);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  let canceledInfo = null;
  let canceledUser = null;
  let cancelReason = null;
  if (application.status === "canceled") {
    canceledUser = crmUsers.find(
      (u) => u.id === application.cancelUserId.Int64
    );
    cancelReason = application.cancelReason.String;
    canceledInfo = (
      <>
        <ListItem
          sx={{
            pl: 4,
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              width: "100%",
            }}
          >
            <ListItemText
              sx={{ marginRight: 2, flexGrow: 10 }}
              primary="Скасував:"
              secondary={`${canceledUser?.lastName} ${canceledUser?.firstName} ${canceledUser?.middleName}`}
            />
            <ListItemText
              sx={{ marginRight: 2 }}
              primary={"Дата скасування"}
              secondary={
                format(parseISO(application.canceledAt.Time), "dd.MM.yyyy") +
                " " +
                format(parseISO(application.canceledAt.Time), "HH:mm")
              }
            />
          </Box>
        </ListItem>
        <ListItem sx={{ pl: 4, flexWrap: "wrap" }}>
          <ListItemText
            sx={{ marginRight: 2, flexGrow: 10 }}
            primary="Причина скасування:"
            secondary={cancelReason}
          />
        </ListItem>
      </>
    );
  }

  const badge: Badge = {
    content: "Новий",
    color: "primary",
  };

  if (application.status === "canceled") {
    badge.content = "Скасований";
    badge.color = "error";
  }

  return (
    <Paper
      sx={{
        padding: 2,
        textAlign: "center",
        marginTop: 2,
        width: "100%",
      }}
      elevation={24}
    >
      <Badge
        sx={{ width: "100%" }}
        badgeContent={badge.content}
        color={badge.color}
      >
        <List key={application.id} sx={{ width: "100%" }}>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>{application.id}</ListItemIcon>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                width: "100%",
              }}
            >
              <ListItemText
                sx={{ marginRight: 2, flexGrow: 10 }}
                primary={`${patient?.lastName} ${patient?.firstName} ${patient?.middleName}`}
                secondary={`${filial?.city}`}
              />
              <ListItemText
                sx={{ marginRight: 2 }}
                primary={format(
                  parseISO(application.startDateTime),
                  "dd.MM.yyyy"
                )}
                secondary={
                  format(parseISO(application.startDateTime), "HH:mm") +
                  " - " +
                  format(parseISO(application.endDateTime), "HH:mm")
                }
              />
            </Box>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem sx={{ pl: 4, flexWrap: "wrap" }}>
                <ListItemText
                  sx={{ marginRight: 2, flexGrow: 10 }}
                  primary="Опис проблеми:"
                  secondary={application.description}
                />
              </ListItem>
              {application.status === "new" && (
                <ListItem
                  sx={{
                    pl: 4,
                    display: "flex",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      width: "100%",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <CancelButton
                      applicationId={application.id}
                      handleClickOpenDialog={handleClickOpenDialog}
                      openDialog={openDialog}
                      handleCloseDialog={handleCloseDialog}
                    />
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      sx={{ flex: "1 1 auto", minWidth: "120px" }}
                    >
                      Записати на прийом
                    </Button>
                  </ListItemIcon>
                </ListItem>
              )}

              {canceledInfo}
            </List>
          </Collapse>
        </List>
      </Badge>
    </Paper>
  );
};

export default ApplicationItem;

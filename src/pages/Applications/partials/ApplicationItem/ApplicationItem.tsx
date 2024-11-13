import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import Badge from "@mui/material/Badge";

import { useAppSelector, useAppDispatch } from "../../../../hooks";
import { selectFilials } from "../../../../store/features/filials/filialsSlice";
import { selectCrmUsers } from "../../../../store/features/crmUsers/crmUsersSlice";
import { CancelButton } from "..";
import { APP_ROUTES } from "../../../../constants";
import { setPageData } from "../../../../store/features/pageData/pageDataSlice";

type Badge = {
  content: string;
  color: "primary" | "secondary" | "error" | "info" | "success" | "warning";
};

type ApplicationItemProps = {
  application: Application;
};

const ApplicationItem = ({ application }: ApplicationItemProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filials = useAppSelector(selectFilials);
  const crmUsers = useAppSelector(selectCrmUsers);
  const filial = filials.find((f) => f.id === application.filialId);
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

  const handleClickAddAppointment = () => {
    dispatch(
      setPageData({
        page: APP_ROUTES.ADD_APPOINTMENT,
        data: {
          patientId: application.patientId,
          applicationId: application.id,
        },
      })
    );
    navigate(APP_ROUTES.ADD_APPOINTMENT);
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
            pl: 9,
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
        <ListItem sx={{ pl: 9, flexWrap: "wrap" }}>
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

  if (application.status === "approved") {
    badge.content = "Підтверджений";
    badge.color = "success";
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
                primary={`${application.patientLastName} ${application.patientFirstName} ${application.patientMiddleName}`}
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
              <ListItem sx={{ pl: 9, flexWrap: "wrap" }}>
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
                      onClick={handleClickAddAppointment}
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

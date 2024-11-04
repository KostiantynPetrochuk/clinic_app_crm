import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import {
  selectMessage,
  hideMessage,
} from "../store/features/message/messageSlice";

const Message = () => {
  const dispatch = useDispatch();
  const message = useSelector(selectMessage);

  const handleClose = (
    _: Event | React.SyntheticEvent<any, Event>,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideMessage());
  };

  return (
    <Snackbar
      open={message.open}
      autoHideDuration={message.autoHideDuration}
      anchorOrigin={{
        vertical: message.vertical as "top" | "bottom",
        horizontal: message.horizontal as "center" | "left" | "right",
      }}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={message.severity as "error" | "info" | "success" | "warning"}
        sx={{ width: "100%" }}
      >
        <AlertTitle>{message.title}</AlertTitle>
        {message.text}
      </Alert>
    </Snackbar>
  );
};

export default Message;

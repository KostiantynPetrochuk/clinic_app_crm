import { useState } from "react";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import useAuth from "../../../../hooks/useAuth";
import useFetchPrivate from "../../../../hooks/useFetchPrivate";
import { updateApplication } from "../../../../store/features/applications/applicationsSlice";
import { useAppDispatch } from "../../../../hooks";
import useLoading from "../../../../hooks/useLoading";

type CancelButtonProps = {
  applicationId: number;
  handleClickOpenDialog: () => void;
  openDialog: boolean;
  handleCloseDialog: () => void;
};

const CancelButton = ({
  applicationId,
  handleClickOpenDialog,
  openDialog,
  handleCloseDialog,
}: CancelButtonProps) => {
  const dispatch = useAppDispatch();
  const { startLoading, stopLoading } = useLoading();
  const { auth } = useAuth();
  const fetchPrivate = useFetchPrivate();
  const [cancelReason, setCancelReason] = useState("");

  const handleChangeCancelReason = (event: SelectChangeEvent) => {
    setCancelReason(event.target.value as string);
  };

  const handleSubmit = () => {
    startLoading();
    const body = {
      applicationId,
      cancelUserId: auth?.id,
      cancelReason,
    };
    const cancelApplication = async () => {
      const { data, error } = await fetchPrivate("applications/cancel", {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      if (error) {
        stopLoading();
        console.error(error);
        return;
      }
      dispatch(updateApplication(data));
      stopLoading();
    };
    cancelApplication();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<CancelIcon />}
        sx={{ flex: "1 1 auto", minWidth: "120px" }}
        color="error"
        onClick={handleClickOpenDialog}
      >
        Скасувати
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Скасувати запис #${applicationId} ?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Щоб скасувати запис, вкажіть причину
          </DialogContentText>
          <Box sx={{ minWidth: 120, marginTop: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Причина відмови
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cancelReason}
                label="Причина відмови"
                onChange={handleChangeCancelReason}
              >
                <MenuItem value={"changed_my_mind"}>Клієнт передумав</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Повернутись</Button>
          <Button variant="contained" onClick={handleSubmit} autoFocus>
            Скасувати запис
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CancelButton;

import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { APP_ROUTES } from "../../constants";
import { useAppSelector } from "../../hooks";
import { selectFilials } from "../../store/features/filials/filialsSlice";

const Filials = () => {
  const filials = useAppSelector(selectFilials);
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
              Філії
            </Typography>
          </Paper>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Paper
              sx={{
                padding: 2,
                textAlign: "center",
                marginTop: 2,
              }}
              elevation={24}
            >
              {filials.map((filial) => (
                <List key={filial.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to={`${APP_ROUTES.FILIALS}/${filial.id}`}
                    >
                      <ListItemIcon>{filial.id}</ListItemIcon>
                      <ListItemText
                        primary={`${filial.region} - ${filial.city}`}
                        secondary={`${filial.address}, тел: ${filial.phone}`}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Filials;

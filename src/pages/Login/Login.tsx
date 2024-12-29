import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import useMessage from "../../hooks/useMessage";
import useLoading from "../../hooks/useLoading";
import {
  selectPersist,
  setPersist,
} from "../../store/features/persist/persistSlice";
import { API_URL, APP_ROUTES, PHONE_COUNTRY_CODES } from "../../constants";

const Login = () => {
  const { setAuth } = useAuth();
  const showMessage = useMessage();
  const { startLoading, stopLoading } = useLoading();
  const dispatch = useDispatch();
  const persist = useSelector(selectPersist);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || APP_ROUTES.HOME;
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // const navigateToRegister = () => navigate(APP_ROUTES.REGISTER);
  const handleInputPhone = () => setIsPhoneValid(true);
  const handleInputPassword = () => setIsPasswordValid(true);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phoneCountryCode = data.get("phoneCountryCode");
    const phoneNumber = data.get("phoneNumber");
    const pwd = data.get("password");
    if (!phoneNumber || !(phoneNumber as string).length) {
      setIsPhoneValid(false);
    }
    if (!pwd || !(pwd as string).length) {
      setIsPasswordValid(false);
    }
    if (
      !phoneNumber ||
      !(phoneNumber as string).length ||
      !pwd ||
      !(pwd as string).length
    ) {
      showMessage({
        title: "Помилка!",
        text: "Вкажіть коректні дані: телефон та пароль!",
        severity: "error",
      });
      return;
    }
    try {
      startLoading();
      const body = {
        phoneCountryCode,
        phoneNumber,
        password: pwd,
      };
      const url = `${API_URL}signin`;
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(body),
      });
      if (response.status === 401) {
        setIsPhoneValid(false);
        setIsPasswordValid(false);
        showMessage({
          title: "Помилка!",
          text: "Не вірно вказано електронну пошту, або пароль.",
          severity: "error",
        });
        stopLoading();
        return;
      }
      const data = await response.json();
      const authData = data.user;
      authData.token = data.tokens.accessToken;
      if (persist) {
        window.localStorage.setItem("refreshToken", data.tokens.refreshToken);
      }
      setAuth(authData);
      stopLoading();
      navigate(from, { replace: true });
    } catch (error) {
      stopLoading();
      showMessage({
        title: "Помилка!",
        text: "Сервер не відповідає. Будь ласка, спробуйте пізніше.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Вхід
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="phone-country-code-label">
              Код країни телефону
            </InputLabel>
            <Select
              labelId="phone-country-code-label"
              id="phone-country-code"
              name="phoneCountryCode"
              defaultValue="+380"
              label="Код країни телефону"
            >
              {Object.keys(PHONE_COUNTRY_CODES).map((key) => (
                <MenuItem value={key}>
                  {PHONE_COUNTRY_CODES[key as keyof typeof PHONE_COUNTRY_CODES]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            error={!isPhoneValid}
            margin="normal"
            required
            fullWidth
            id="phoneNumber"
            label="Телефон"
            name="phoneNumber"
            autoComplete="phoneNumber"
            autoFocus
            onInput={handleInputPhone}
          />
          <TextField
            error={!isPasswordValid}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            onInput={handleInputPassword}
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                checked={persist}
                onClick={() =>
                  persist
                    ? dispatch(setPersist(false))
                    : dispatch(setPersist(true))
                }
                color="primary"
              />
            }
            label="Запам'ятати мене"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Увійти
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Забули пароль?
              </Link>
            </Grid>
            <Grid item>
              <Link
                sx={{ cursor: "pointer" }}
                variant="body2"
                onClick={navigateToRegister}
              >
                {"Не маєте аккаунту? Реєстрація"}
              </Link>
            </Grid>
          </Grid> */}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;

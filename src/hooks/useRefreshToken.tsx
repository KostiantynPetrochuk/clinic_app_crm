import useAuth from "./useAuth";
import { API_URL } from "../constants";
import { useAppSelector, useAppDispatch } from "./index";
import {
  selectCrmUsers,
  setCrmUsers,
} from "../store/features/crmUsers/crmUsersSlice";
import {
  selectFilials,
  setFilials,
} from "../store/features/filials/filialsSlice";
import {
  selectDoctors,
  setDoctors,
} from "../store/features/doctors/doctorsSlice";
import {
  selectPatients,
  setPatients,
} from "../store/features/patients/patientsSlice";
import {
  selectApplications,
  setApplications,
} from "../store/features/applications/applicationsSlice";
import {
  selectAppointments,
  setAppointments,
} from "../store/features/appointments/appointmentsSlice";

const useRefreshToken = () => {
  const dispatch = useAppDispatch();
  const { setAuth } = useAuth();
  const crmUsers = useAppSelector(selectCrmUsers);
  const filials = useAppSelector(selectFilials);
  const doctors = useAppSelector(selectDoctors);
  const patients = useAppSelector(selectPatients);
  const applications = useAppSelector(selectApplications);
  const appointments = useAppSelector(selectAppointments);
  const refresh = async () => {
    try {
      const refreshToken = window.localStorage.getItem("refreshToken");
      const response = await fetch(`${API_URL}refresh`, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      });
      const result = await response.json();
      const newAuth = result.user;
      newAuth.token = result.tokens.accessToken;
      window.localStorage.setItem("refreshToken", result.tokens.refreshToken);
      setAuth(newAuth);
      // == update init data == //
      if (!crmUsers.length) {
        const response = await fetch(`${API_URL}crm-users`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${result.tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });
        const crmUsersResult = await response.json();
        dispatch(setCrmUsers(crmUsersResult));
      }
      if (!filials.length) {
        const response = await fetch(`${API_URL}filials`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${result.tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });
        const filialsResult = await response.json();
        dispatch(setFilials(filialsResult));
      }
      if (!doctors.length) {
        const response = await fetch(`${API_URL}doctors`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${result.tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });
        const doctorsResult = await response.json();
        dispatch(setDoctors(doctorsResult));
      }
      if (!patients.length) {
        const response = await fetch(`${API_URL}patients`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${result.tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });
        const patientsResult = await response.json();
        dispatch(setPatients(patientsResult));
      }
      if (!applications.length) {
        const response = await fetch(`${API_URL}applications`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${result.tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });
        const applicationsResult = await response.json();
        dispatch(setApplications(applicationsResult));
      }
      if (!appointments.length) {
        const response = await fetch(`${API_URL}appointments`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${result.tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        });
        const appointmentsResult = await response.json();
        dispatch(setAppointments(appointmentsResult));
      }
      //
      return result.token;
    } catch (error) {
      return false;
    }
  };
  return refresh;
};

export default useRefreshToken;

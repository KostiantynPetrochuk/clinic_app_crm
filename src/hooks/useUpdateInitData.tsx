import { useEffect } from "react";
import useAuth from "./useAuth";
import { useAppDispatch } from "./index";
import { setCrmUsers } from "../store/features/crmUsers/crmUsersSlice";
import { setFilials } from "../store/features/filials/filialsSlice";
import { setDoctors } from "../store/features/doctors/doctorsSlice";
import { setPatients } from "../store/features/patients/patientsSlice";
import useFetchPrivate from "./useFetchPrivate";

const useUpdateInitData = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAuth();
  const fetchPrivate = useFetchPrivate();

  useEffect(() => {
    if (!auth?.token) return;
    const fetchCrmUsers = async () => {
      const { data, error } = await fetchPrivate("crm-users");
      if (error) {
        return;
      }
      dispatch(setCrmUsers(data));
    };
    const fetchFilials = async () => {
      const { data, error } = await fetchPrivate("filials");
      if (error) {
        return;
      }
      dispatch(setFilials(data));
    };
    const fetchDoctors = async () => {
      const { data, error } = await fetchPrivate("doctors");
      if (error) {
        return;
      }
      dispatch(setDoctors(data));
    };
    const fetchPatients = async () => {
      const { data, error } = await fetchPrivate("patients");
      if (error) {
        return;
      }
      dispatch(setPatients(data));
    };
    const fetchAllData = async () => {
      await Promise.all([
        fetchCrmUsers(),
        fetchFilials(),
        fetchDoctors(),
        fetchPatients(),
      ]);
    };

    let intervalId;
    fetchAllData();
    intervalId = setInterval(() => {
      fetchAllData();
    }, 300_000);
    return () => clearInterval(intervalId);
  }, [auth?.token]);
};

export default useUpdateInitData;

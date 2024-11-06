import useAuth from "./useAuth";
import { API_URL } from "../constants";
import { useAppSelector, useAppDispatch } from "./index";
import {
  selectCrmUsers,
  setCrmUsers,
} from "../store/features/crmUsers/crmUsersSlice";

const useRefreshToken = () => {
  const dispatch = useAppDispatch();
  const { setAuth } = useAuth();
  const crmUsers = useAppSelector(selectCrmUsers);
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
      //
      return result.token;
    } catch (error) {
      return false;
    }
  };
  return refresh;
};

export default useRefreshToken;

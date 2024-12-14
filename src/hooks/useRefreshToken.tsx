import useAuth from "./useAuth";
import { API_URL } from "../constants";
import useLogout from "./useLogout";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const logout = useLogout();
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
      if (response.status === 401) {
        await logout();
        return false;
      }
      const result = await response.json();
      const newAuth = result.user;
      newAuth.token = result.tokens.accessToken;
      window.localStorage.setItem("refreshToken", result.tokens.refreshToken);
      setAuth(newAuth);
      return result?.tokens?.accessToken;
    } catch (error) {
      return false;
    }
  };
  return refresh;
};

export default useRefreshToken;

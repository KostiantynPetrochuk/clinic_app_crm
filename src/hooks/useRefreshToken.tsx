import useAuth from "./useAuth";
import { API_URL } from "../constants";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
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
      return result.token;
    } catch (error) {
      return false;
    }
  };
  return refresh;
};

export default useRefreshToken;

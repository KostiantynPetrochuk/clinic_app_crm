import useAuth from "./useAuth";
import { API_URL } from "../constants";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    window.localStorage.removeItem("refreshToken");
    try {
      await fetch(`${API_URL}logout`, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
};

export default useLogout;

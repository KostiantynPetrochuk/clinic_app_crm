import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { API_URL } from "../constants";

const useFetchPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
  }

  const fetchPrivate = async (url: string, options: FetchOptions = {}) => {
    if (!options.headers) {
      options.headers = {};
    }
    if (!options.method) {
      options.method = "GET";
    }
    options.headers["Authorization"] = `Bearer ${auth?.token}`;
    options.headers["Content-Type"] = "application/json";
    options.credentials = "include";
    options.mode = "cors";
    options.cache = "no-cache";
    options.redirect = "follow";
    options.referrerPolicy = "no-referrer";
    try {
      const response = await fetch(`${API_URL}${url}`, options);

      if (response.status === 401) {
        const newAccessToken = await refresh();
        options.headers["Authorization"] = `Bearer ${newAccessToken}`;
        const newResponse = await fetch(`${API_URL}${url}`, options);
        const newResult = await newResponse.json();
        return { data: newResult, error: null };
      }

      const result = await response.json();
      return { data: result, error: null };
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(String(error));
      }
      return { data: null, error };
    }
  };

  return fetchPrivate;
};

export default useFetchPrivate;

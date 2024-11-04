import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import useRefreshToken from "../hooks/useRefreshToken";
import useLoading from "../hooks/useLoading";
import { selectPersist } from "../store/features/persist/persistSlice";
import Loading from "./Loading";

const PersistLogin = () => {
  const { startLoading, stopLoading } = useLoading();
  const refresh = useRefreshToken();
  const persist = useSelector(selectPersist);
  const done = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (persist) {
      const verifyRefreshToken = async () => {
        startLoading();
        try {
          await refresh();
        } catch (error) {
          console.log(error);
        } finally {
          stopLoading();
          setIsLoading(false);
        }
      };
      if (done.current === false) {
        verifyRefreshToken();
        done.current = true;
      }
    }
  }, []);

  return <>{!persist ? <Outlet /> : isLoading ? <Loading /> : <Outlet />}</>;
};

export default PersistLogin;

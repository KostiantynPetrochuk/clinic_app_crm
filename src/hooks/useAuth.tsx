import { useSelector, useDispatch } from "react-redux";

import { setAuthData } from "../store/features/auth/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((store: { auth: any }) => store.auth);
  const setAuth = (authData: any) => dispatch(setAuthData(authData));
  return { auth, setAuth };
};

export default useAuth;

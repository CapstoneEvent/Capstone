import { useAuthContext } from "./useAuthContext";
import Cookies from "js-cookie";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");
    Cookies.remove("auth_token");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};

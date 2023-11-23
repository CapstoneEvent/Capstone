import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import Cookies from "js-cookie";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.non_field_errors[0]);
    }
    if (response.ok) {
      Cookies.set("auth_token", json.data.token, { expires: 1 }); // "expires" sets the expiration in days
      const userFetch = await fetch("/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (userFetch.ok) {
        const userData = await userFetch.json();

        // update the auth context & set local data
        localStorage.setItem("user", JSON.stringify(userData.data));
        dispatch({ type: "LOGIN", payload: userData.data });
      }

      // update loading state
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};

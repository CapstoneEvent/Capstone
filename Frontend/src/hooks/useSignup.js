import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import Cookies from "js-cookie";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (username, password, email, phoneNumber) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        first_name: "",
        last_name: "",
        profile: { phone: phoneNumber, status: "2" },
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.data.errors);
    }
    if (response.ok) {
      console.log(json);
      // save the user to local storage
      Cookies.set("auth_token", json.data.token, { expires: 1 }); // "expires" sets the expiration in days

      // update the auth context
      dispatch({ type: "LOGIN", payload: json.data });

      // update loading state
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};

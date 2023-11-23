import { useState } from "react";

export const useChangePassword = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const changePassword = async (oldpassword, password) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: oldpassword, new_password: password }),
    });
    const json = await response.json();

    if (!json.data.status) {
      setIsLoading(false);
      setError(json.data.message);
    }
    if (json.data.status) {
      setSuccess(json.data.message);
    }

    // update loading state
    setIsLoading(false);
  };

  return { changePassword, isLoading, error, success };
};

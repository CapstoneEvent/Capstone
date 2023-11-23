// ChangePassword.js
import React, { useState } from "react";
import { useChangePassword } from "../hooks/useChangePassword";
const ChangePassword = ({ onClose }) => {
  // Implement your password change form logic here
  const [oldpassword, setOldpassword] = useState("");
  const [password, setPassword] = useState("");
  const { changePassword, error, isLoading, success } = useChangePassword();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await changePassword(oldpassword, password);
  };

  return (
    <div className="change-password-modal">
      <form className="login" onSubmit={handleSubmit}>
        <h3>Change Password</h3>

        <label>Old Password:</label>
        <input type="text" onChange={(e) => setOldpassword(e.target.value)} value={oldpassword} />
        <label>Password:</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />

        <button disabled={isLoading}>Update Password</button>
        <button onClick={() => onClose()}>Close</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <br></br>
      </form>
    </div>
  );
};

export default ChangePassword;

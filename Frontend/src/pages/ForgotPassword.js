import React, { useState } from "react";

const PasswordRecoveryForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // New state for success message

  const handleNext = async () => {
    setError(null);
    setSuccessMessage(null);
    switch (step) {
      case 1:
        try {
          // Make an API call to request password recovery
          const response = await fetch("/forgot_password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.status) {
              setStep(2);
            } else {
              setError(data.message);
            }
          } else {
            // Handle error
            console.error("Error in step 1:", response.statusText);
          }
        } catch (error) {
          // Handle network error
          console.error("Network error in step 1:", error);
        }
        break;

      case 2:
        try {
          // Make an API call to validate the verification code
          const response = await fetch("/validate_token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: verificationCode }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.status) {
              setStep(3);
            } else {
              setError(data.message);
            }
          } else {
            // Handle error
            console.error("Error in step 2:", response.statusText);
          }
        } catch (error) {
          // Handle network error
          console.error("Network error in step 2:", error);
        }
        break;

      case 3:
        try {
          // Make an API call to update the password
          const response = await fetch("/update_password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: verificationCode, password: newPassword }),
          });

          if (response.ok) {
            // Password updated successfully, you may redirect the user or show a success message
            const data = await response.json();
            if (data.status) {
              setStep(4);
              setSuccessMessage(data.message);
            } else {
              setError(data.message);
            }
          } else {
            // Handle error
            console.error("Error in step 3:", response.statusText);
          }
        } catch (error) {
          // Handle network error
          console.error("Network error in step 3:", error);
        }
        break;
      case 4:
        setSuccessMessage("Password reset successfully! You can now log in with your new password.");
        break;

      default:
        break;
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="forgotpassword">
        <h3>Password Recovery</h3>
        {step === 1 && (
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}
        {step === 2 && (
          <div>
            <label>Verification Code:</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <label>New Password:</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
        )}
        {step < 4 && (
          <div className="forgot-btn">
            {step === 2 && (
              <button type="button" onClick={handleBack}>
                Back
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit">Reset Password</button>
            )}
          </div>
        )}
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </form>
    </div>
  );
};

export default PasswordRecoveryForm;

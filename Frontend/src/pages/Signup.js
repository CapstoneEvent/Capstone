import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState(""); // Added Username field
  const [validationErrors, setValidationErrors] = useState({});

  const { signup, error, isLoading } = useSignup();

  const validatePassword = (value) => {
    // Password validation: should be a six-digit alphanumeric
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,32}$/;
    return regex.test(value);
  };

  const validatePhoneNumber = (value) => {
    // Phone number validation: should be a 10-digit number
    const regex = /^\d{10}$/;
    return regex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!validatePassword(password)) {
      errors.password = "Password should be a six-digit alphanumeric";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    }
    // You can add more validation for email format, phone number, etc.
    if (!validatePhoneNumber(phoneNumber)) {
      errors.phoneNumber = "Phone number should be 10 digits";
    }

    // If there are validation errors, set them in state and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // If no validation errors, clear any previous validation errors
    setValidationErrors({});

    await signup(username, password, email, phoneNumber); // Pass Username to the signup function
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <label>Username:</label>
      <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
      {validationErrors.username && <div className="error">{validationErrors.username}</div>}
      <label>Password:</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
      {validationErrors.password && <div className="error">{validationErrors.password}</div>}
      <label>Email address:</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      {validationErrors.email && <div className="error">{validationErrors.email}</div>}
      <label>Phone Number:</label>
      <input type="text" onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} />
      {validationErrors.phoneNumber && <div className="error">{validationErrors.phoneNumber}</div>}

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;

import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState(""); // Added Username field
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(username, password, email, phoneNumber); // Pass Username to the signup function
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <label>Username:</label>
      <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
      <label>Password:</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
      <label>Email address:</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <label>Phone Number:</label>
      <input type="text" onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} />
      <button disabled={isLoading}>Sign up</button>
      {/* {error && <div className="error">{error}</div>} */}
    </form>
  );
};

export default Signup;

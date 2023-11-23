import React, { useEffect, useState } from "react";
import ChangePassword from "../components/ChangePassword";

const AccountPage = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    // Fetch user details when the component mounts
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/user");
      if (response.ok) {
        const userData = await response.json();
        setUserData(userData.data);
        setLoading(false);
      } else {
        console.error("Error fetching user details:", response.statusText);
        setLoading(false); // Set loading to false even in case of an error
      }
    } catch (error) {
      console.error("Network error:", error, "asd");
      setLoading(false); // Set loading to false in case of a network error
    }
  };

  const handleStartChangePassword = () => {
    console.log("hits");
    setShowChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    console.log("jits");
    setShowChangePasswordModal(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="account-page">
      <form className="my-account">
        <h2>Account Details</h2>
        <div>
          <label>Email:</label>
          <input type="text" value={userData.email} disabled />
        </div>
        <div>
          <label>ID:</label>
          <input type="text" value={userData.id} disabled />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" value={userData.phone} disabled />
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={userData.username} disabled />
        </div>
        <button onClick={handleStartChangePassword}>Change Password</button>
      </form>
      {showChangePasswordModal && (
        <div className="modal-overlay">
          <ChangePassword onClose={handleCloseChangePasswordModal} />
        </div>
      )}
    </div>
  );
};

export default AccountPage;

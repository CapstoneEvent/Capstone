import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const VerifyBooking = () => {
  const [token, setToken] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleTokenInputChange = (e) => {
    setToken(e.target.value);
  };

  const handleVerifyToken = async () => {
    try {
      const response = await fetch("/booking/booking_verification/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: token }),
      });

      const data = await response.json();
      if (response.ok) {
        setBookingData(data.data);
        setErrorMessage("");
      } else {
        setBookingData(null);
        setErrorMessage(data.message || "An error occurred.");
      }
      setOpenModal(true);
    } catch (error) {
      console.error("Network error:", error);
      setBookingData(null);
      setErrorMessage("Network error.");
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setToken("");
    setBookingData(null);
    setErrorMessage("");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Token Verification</h1>
        <div className="mb-4">
          <label htmlFor="token" className="block text-sm font-medium text-gray-700">
            Enter Token:
          </label>
          <input
            type="text"
            id="token"
            name="token"
            value={token}
            onChange={handleTokenInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <button onClick={handleVerifyToken} className="bg-green-500 text-white px-4 py-2 rounded-md">
            Verify Token
          </button>
        </div>

        {/* Modal */}
          <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
            <DialogTitle className={`bg-${bookingData ? 'green' : 'red'}-300 text-center mb-4 font-bold`}>
              {bookingData ? "Booking Details" : "Error"}
            </DialogTitle>
            <DialogContent className="text-center">
              {bookingData ? (
                <div className="flex flex-col items-center space-y-4 success">
                  {/* Success message and data display */}
                  <Typography variant="h6" paragraph className="font-bold">
                    Event: {bookingData["Event Title"]}
                  </Typography>
                  <Typography variant="h6" paragraph className="font-bold">
                    Quantity: {bookingData["Booking Quantity"]}
                  </Typography>
                  <Typography variant="h6" paragraph className="font-bold">
                    Total: CAD {bookingData["Total Cost"]}
                  </Typography>
                </div>
              ) : (
                // Display error message
                <>
                <div className="error">
                  <p>{errorMessage}</p>
                </div>
                </>
              )}
            </DialogContent>
            <DialogActions className="justify-center mt-1">
              <button onClick={handleCloseModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Close
              </button>
            </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default VerifyBooking;

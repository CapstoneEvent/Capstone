import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const VerifyBooking = () => {
  const [token, setToken] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleTokenInputChange = (e) => {
    setToken(e.target.value);
  };

  const handleVerifyToken = async () => {
    try {
      const response = await fetch("http://localhost:8000/booking/booking_verification/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ token: token }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookingData(data);
        setOpenModal(true);
      } else {
        console.error("Error verifying token:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setToken("");
    setBookingData(null);
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
          <DialogTitle className="bg-green-300 text-center mb-4 font-bold">Booking Details</DialogTitle>
          <DialogContent className="text-center">
            {bookingData ? (
              <div className="flex flex-col items-center space-y-4">
                <Typography variant="hea" paragraph className="font-bold">
                  Event: {bookingData.event}
                </Typography>
                <Typography variant="hea" paragraph className="font-bold">
                  Quantity: {bookingData.quantity}
                </Typography>
                <Typography variant="hea" paragraph className="font-bold">
                  Total: CAD {bookingData.total}
                </Typography>
              </div>
            ) : (
              <p>No data available for the provided token.</p>
            )}
          </DialogContent>
          <DialogActions className="justify-center mt-1 qrb">
            <Button onClick={handleCloseModal} variant="contained" color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default VerifyBooking;

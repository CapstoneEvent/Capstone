import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import QRCode from "qrcode.react";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    // Fetch bookings
    const fetchBookings = async () => {
      try {
        const response = await fetch("/booking/bookings/");
        if (response.ok) {
          const bookingData = await response.json();
          console.log(bookingData);
          if (user.status === 0) {
            setBookings(bookingData.data);
          } else {
            const filteredEvents = bookingData.data.filter((event) => event.user === user.id);
            console.log(filteredEvents);
            setBookings(filteredEvents);
          }
        } else {
          console.error("Error fetching bookings:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleCardClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4">Booking Page</h1>
      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => handleCardClick(booking)} // Added onClick handler
              className="bg-green-100 p-4 rounded-lg shadow-md cursor-pointer"
            >
              <p className="text-lg font-semibold mb-2">Event: {booking.event}</p>
              <p className="mb-2">Quantity: {booking.quantity}</p>
              <p className="mb-2">Total: CAD {booking.total}</p>
              <hr className="my-2" />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={Boolean(selectedBooking)} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle className="bg-green-300 text-center mb-4 font-bold">QR Code and Details</DialogTitle>
        <DialogContent className="text-center">
          <div className="flex flex-col items-center space-y-4">
            {/* Generate QR code using verification_token */}
            <QRCode value={selectedBooking?.verification_token} size={300} className="mt-4" />
            <Typography variant="hea" paragraph className="font-bold">
              {selectedBooking?.verification_token}
            </Typography>
            <Typography variant="hea" paragraph className="font-bold">
              Quantity: {selectedBooking?.quantity}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions className="justify-center mt-1 qrb">
          <button onClick={handleCloseModal} variant="contained">
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingPage;

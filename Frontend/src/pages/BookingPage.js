// BookingPage.js
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    // Fetch bookings
    const fetchBookings = async () => {
      try {
        const response = await fetch("/booking/bookings/");
        if (response.ok) {
          const bookingData = await response.json();
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

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4">Booking Page</h1>
      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-green-100 p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold mb-2">Event: {booking.event}</p>
              <p className="mb-2">Quantity: {booking.quantity}</p>
              <p className="mb-2">Total: CAD {booking.total}</p>
              <hr className="my-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPage;

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
          console.log(bookingData.data);
          const filteredEvents = bookingData.data.filter((event) => event.user === user.id);
          console.log(filteredEvents);
          setBookings(filteredEvents);
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
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <p>Event: {booking.event}</p>
              <p>Quantity: {booking.quantity}</p>
              <p>Total: CAD {booking.total}</p>
              <hr></hr>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingPage;

// EventDetailsPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EventDetailsPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1); // Initial quantity state

  useEffect(() => {
    // Fetch event details based on the slug
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/event/events/${slug}`);
        if (response.ok) {
          const eventData = await response.json();
          setEvent(eventData.data);
        } else {
          console.error("Error fetching event details:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchEventDetails();
  }, [slug]);

  const handleBuyTickets = async () => {
    try {
      const response = await fetch(`/booking/bookings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total: quantity * event.price, event: slug, quantity }),
      });

      if (response.ok) {
        toast.success("Tickets purchased successfully!");
      } else {
        toast.success(response.statusText);
        console.error("Error purchasing tickets:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4">{event.name} Details</h1>
      <div className="border p-4">
        <div className="card hover:shadow-lg">
          <img
            src={`https://api.ellecanada.com/app/uploads/2023/07/canada-music-festivals.jpg`}
            alt="img"
            className="h-32 sm:h-48 w-full object-cover"
          />
          <div className="m-4">
            <span className="block text-gray-500 text-sm">{event.price}</span>
            <span className="block text-gray-500 text-sm">{event.description}</span>
          </div>
          <div className="m-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border rounded w-16 py-2 px-3"
              min="1"
            />
          </div>
          <button onClick={handleBuyTickets} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 m-2">
            Buy Tickets
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EventDetailsPage;

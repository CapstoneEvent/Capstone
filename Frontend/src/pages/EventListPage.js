// EventListPage.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const cardStyle = {
    backgroundImage: `url(${event.cover_picture})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "200px", // Set the desired height for your card
  };

  return (
    <Link to={`/events2/${event.slug}`}>
      <div class="card hover:shadow-lg">
        <img
          src={`https://api.ellecanada.com/app/uploads/2023/07/canada-music-festivals.jpg`}
          alt="img"
          class="h-32 sm:h-48 w-full object-cover"
        />
        <div class="m-4">
          <span class="font-bold truncate block">{event.name}</span>
          <span class="block text-gray-500 text-sm">{event.price}</span>
        </div>
        <div class="badge">
          <svg
            class="inline-block w-5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{event.available_seats} Seats Available</span>
        </div>
      </div>
    </Link>
  );
};

const EventListPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events data from your API endpoint
    // Replace the following with your actual fetch logic
    const fetchData = async () => {
      try {
        const response = await fetch("/event/events");
        if (response.ok) {
          const eventData = await response.json();
          setEvents(eventData.data);
        } else {
          console.error("Error fetching events:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4">Event List</h1>
      <div className="flex flex-wrap justify-between">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventListPage;

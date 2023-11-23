import React, { useState, useEffect } from "react";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    coverPicture: "",
    description: "",
    startDate: "",
    endDate: "",
    availableSeats: 0,
    price: 0,
  });

  // Function to load events from local storage on component mount
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  // Function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Add the new event to the list
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    // Update local storage
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    // Clear the input fields
    setNewEvent({
      name: "",
      coverPicture: "",
      description: "",
      startDate: "",
      endDate: "",
      availableSeats: 0,
      price: 0,
    });
  };

  return (
    <div>
      <h1>Event List</h1>

      {/* Event List */}
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.name}</strong>
            <p>{event.description}</p>
            <p>Start Date: {event.startDate}</p>
            <p>End Date: {event.endDate}</p>
            <p>Available Seats: {event.availableSeats}</p>
            <p>Price: ${event.price}</p>
          </li>
        ))}
      </ul>

      {/* Add Event Form */}
      <form onSubmit={handleFormSubmit} className="login">
        <label>
          Name:
          <input
            type="text"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
          />
        </label>
        <label>
          Cover Picture URL:
          <input
            type="text"
            value={newEvent.coverPicture}
            onChange={(e) => setNewEvent({ ...newEvent, coverPicture: e.target.value })}
          />
        </label>
        <label>
          Description:
          <textarea
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={newEvent.startDate}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={newEvent.endDate}
            onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
          />
        </label>
        <label>
          Available Seats:
          <input
            type="number"
            value={newEvent.availableSeats}
            onChange={(e) => setNewEvent({ ...newEvent, availableSeats: parseInt(e.target.value, 10) })}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={newEvent.price}
            onChange={(e) => setNewEvent({ ...newEvent, price: parseFloat(e.target.value) })}
          />
        </label>
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default EventList;

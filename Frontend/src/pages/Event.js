// EventComponent.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EventComponent = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    cover_picture: "",
    description: "",
    start_date: "",
    end_date: "",
    available_seats: 0,
    price: 0,
    slug: "", // Hidden field
  });

  useEffect(() => {
    // Fetch data from /events on component mount
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/event/events");
      if (response.ok) {
        const eventData = await response.json();
        setEvents(eventData.data);
        console.log(eventData.data);
      } else {
        console.error("Error fetching events:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editEvent ? "PUT" : "POST";
      const url = editEvent ? `/event/events/${editEvent.slug}/` : "/event/events/";
      const formData2 = new FormData();
      formData2.append("name", formData.name);
      formData2.append("description", formData.description);
      formData2.append("start_date", formData.start_date);
      formData2.append("end_date", formData.end_date);
      formData2.append("available_seats", formData.available_seats);
      formData2.append("price", formData.price);
      // formData.append("slug", formData.slug); // Ensure that you handle the slug appropriately on the server

      // Append cover picture if it exists
      if (formData.cover_picture) {
        formData2.append("cover_picture", formData.cover_picture);
      }
      const response = await fetch(url, {
        method,
        body: formData2,
      });

      if (response.ok) {
        setShowModal(false);
        setEditEvent(null);
        setFormData({
          name: "",
          cover_picture: null,
          description: "",
          start_date: "",
          end_date: "",
          available_seats: 0,
          price: 0,
          slug: "",
        });
        fetchData();
      } else {
        console.error("Error saving event:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleEdit = (slug) => {
    // Find the event to edit
    const eventToEdit = events.find((event) => event.slug === slug);

    // Set the form data and open the modal for editing
    setFormData({
      name: eventToEdit.name,
      cover_picture: eventToEdit.cover_picture,
      description: eventToEdit.description,
      start_date: eventToEdit.start_date,
      end_date: eventToEdit.end_date,
      available_seats: eventToEdit.available_seats,
      price: eventToEdit.price,
      slug: eventToEdit.slug,
    });
    setEditEvent(eventToEdit);
    setShowModal(true);
  };

  const handleDelete = async (slug) => {
    try {
      const response = await fetch(`/event/events/${slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Successfully deleted event, refresh data
        fetchData();
      } else {
        console.error("Error deleting event:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  function formatISODate(isoDateString) {
    const parsedDate = new Date(isoDateString);

    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = parsedDate.getFullYear();

    return `${year}-${month}-${day}`;
  }

  return (
    <div className="container mx-auto my-8">
      {/* Display data table */}
      <table className="min-w-full bg-white border border-gray-300">
        {/* Table header */}
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Available Seats</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {events.map((event) => (
            <tr key={event.slug}>
              <td className="px-4 py-2">{event.name}</td>
              <td className="px-4 py-2">{event.description}</td>
              <td className="px-4 py-2">{formatISODate(event.start_date)}</td>
              <td className="px-4 py-2">{formatISODate(event.end_date)}</td>
              <td className="px-4 py-2">{event.available_seats}</td>
              <td className="px-4 py-2">{event.price}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                  onClick={() => handleEdit(event.slug)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>

                <button
                  className="bg-red-500 text-white px-2 py-1 mr-2 rounded"
                  onClick={() => handleDelete(event.slug)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <Link to={`/kanban/${event.slug}`} className="bg-green-500 text-white px-2 py-1 rounded">
                  <FontAwesomeIcon icon={faEye} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to open the modal for adding/editing events */}
      <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded" onClick={() => setShowModal(true)}>
        Add Event
      </button>

      {/* Modal for adding/editing events */}
      {showModal && (
        <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal bg-white p-8 rounded">
            {/* Add Event Form */}
            <form onSubmit={handleSubmit}>
              {/* Form fields */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                  type="text"
                  className="border rounded w-full py-2 px-3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Cover Picture:</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border rounded w-full py-2 px-3"
                  onChange={(e) => setFormData({ ...formData, cover_picture: e.target.files[0] })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                <textarea
                  className="border rounded w-full py-2 px-3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
                <input
                  type="date"
                  className="border rounded w-full py-2 px-3"
                  value={formatISODate(formData.start_date)}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
                <input
                  type="date"
                  className="border rounded w-full py-2 px-3"
                  value={formatISODate(formData.end_date)}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Available Seats:</label>
                <input
                  type="number"
                  className="border rounded w-full py-2 px-3"
                  value={formData.available_seats}
                  onChange={(e) => setFormData({ ...formData, available_seats: parseInt(e.target.value, 10) })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                <input
                  type="number"
                  className="border rounded w-full py-2 px-3"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
              {/* Submit button */}
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit
              </button>
            </form>

            {/* Close modal button */}
            <button className="bg-gray-500 text-white px-4 py-2 mt-4 rounded" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventComponent;

import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

const UsersCRUDPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    profile: {
      phone: "",
      status: "0", // Default role is 'Admin'
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/admin/users/");
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      setLoading(true);

      await fetch("/admin/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setShowModal(false);
      await fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Error creating user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    try {
      setLoading(true);

      await fetch(`/admin/users/${selectedUser.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setShowModal(false);
      await fetchUsers();
    } catch (error) {
      console.error("Error editing user:", error);
      setError("Error editing user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await fetch(`/admin/users/${userId}`, { method: "DELETE" });
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      email: "",
      username: "",
      password: "",
      profile: {
        phone: "",
        status: "0",
      },
    });
    setError(null);
  };

  return (
    <div className="container mx-auto p-4">
      <button className="bg-blue-500 text-white py-2 px-4 mb-4 rounded" onClick={() => setShowModal(true)}>
        Create User
      </button>

      {loading && <div className="text-gray-700">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                {user.profile.status === "0" ? "Admin" : user.profile.status === "1" ? "Event Manager" : "Customer"}
              </td>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.profile.phone}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-yellow-500 text-white py-1 px-2 mr-2 rounded"
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData({
                      email: user.email,
                      username: user.username,
                      password: user.password,
                      profile: {
                        phone: user.profile.phone,
                        status: user.profile.status,
                      },
                    });
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button className="bg-red-500 text-white py-1 px-2 rounded" onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md">
            <label className="block mb-2">Email:</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            />
            <label className="block mb-2">Role:</label>
            <select
              value={formData.profile.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: { ...formData.profile, status: e.target.value },
                })
              }
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            >
              <option value="0">Admin</option>
              <option value="1">Event Manager</option>
              <option value="2">Customer</option>
            </select>
            <label className="block mb-2">Username:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            />
            <label className="block mb-2">Phone:</label>
            <input
              type="text"
              value={formData.profile.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile: { ...formData.profile, phone: e.target.value },
                })
              }
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={selectedUser ? handleEditUser : handleCreateUser}
              >
                {selectedUser ? "Update User" : "Create User"}
              </button>
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersCRUDPage;

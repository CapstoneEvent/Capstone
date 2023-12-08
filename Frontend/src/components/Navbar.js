import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const navigate = useNavigate(); 
  const location = useLocation();
  const { logout } = useLogout();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user && user.status === 2 && location.pathname === "/") {
      navigate("/events");
    }
  }, [user, location, navigate]);
  
  const handleClick = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Event Buddy
        </Link>
        <nav>
          {user && (
            <div className="flex space-x-4">
              <Link to="/events" className="hover:text-gray-300">
                Events
              </Link>
              <Link to="/bookings" className="hover:text-gray-300">
                Bookings
              </Link>
              {user.status === 0 && (
                <Link to="/usercrud" className="hover:text-gray-300">
                  Users
                </Link>
              )}
              {(user.status === 0 || user.status === 1) && (
                <Link to="/verifybooking" className="hover:text-gray-300">
                  Ticket Verify
                </Link>
              )}
            </div>
          )}
          {user && (
            <div className="flex items-center space-x-4">
              <Link to="/my-account" className="hover:text-gray-300">
                Account
              </Link>
              <button onClick={handleClick} className="hover:text-gray-300">
                Log out
              </button>
            </div>
          )}

          {!user && (
            <div className="flex space-x-4">
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/signup" className="hover:text-gray-300">
                Signup
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Event Buddy</h1>
        </Link>
        <nav>
          {user && (
            <div>
              {/* <Link to="/kanban">Kanban</Link> */}
              <Link to="/events">Events</Link>
              <Link to="/bookings">Bookings</Link>
              {/* Conditionally render the link based on user.status */}
              {user.status === 0 && <Link to="/usercrud">User</Link>}
            </div>
          )}
          {user && (
            <div>
              <Link to="/my-account">{user.email}</Link>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}

          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

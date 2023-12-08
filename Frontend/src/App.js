import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
// import "./App.css";

// pages & components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordRecoveryForm from "./pages/ForgotPassword";
import AccountPage from "./pages/Account";
import EventList from "./pages/Event";
import Navbar from "./components/Navbar";
import KanbanBoard from "./components/KanbanBoard";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventListPage from "./pages/EventListPage";
import BookingPage from "./pages/BookingPage";
import UsersCRUDPage from "./pages/UsersCRUDPage";
import VerifyBooking from "./pages/VerifyBooking";
import EventDashboard from "./pages/Dash";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={
                user && (user?.status === 0 || user?.status === 1) ? (
                  <EventDashboard />
                ) : user ? (
                  <Home />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} /> */}
            <Route path="/my-account" element={user ? <AccountPage /> : ""} />
            <Route path="/kanban/:slug" element={user ? <KanbanBoard /> : ""} />
            <Route path="/bookings" element={user ? <BookingPage /> : ""} />
            <Route
              path="/events"
              element={user && user?.status === 2 ? <EventListPage /> : user ? <EventList /> : null}
            />
            <Route path="/usercrud" element={user && user?.status === 0 ? <UsersCRUDPage /> : user ? <Home /> : null} />
            <Route
              path="/verifybooking"
              element={user && (user?.status === 0 || user?.status === 1) ? <VerifyBooking /> : user ? <Home /> : null}
            />
            <Route path="/events/:slug" element={user ? <EventDetailsPage /> : ""} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            <Route path="/forgotpassword" element={!user ? <PasswordRecoveryForm /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

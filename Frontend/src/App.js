import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
// import "./App.css";

// pages & components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordRecoveryForm from "./pages/ForgotPassword";
import AccountPage from "./pages/Account";
import EventList from "./pages/Evets";
import Navbar from "./components/Navbar";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/my-account" element={user ? <AccountPage /> : ""} />
            <Route path="/kanban" element={user ? <KanbanBoard /> : ""} />
            <Route path="/events" element={user ? <EventList /> : ""} />
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

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import './App.css';
import Nav from "./components/Nav";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Nav />
      <Container>
        <Routes>
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

import { Navbar, Nav as BootstrapNav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">Event Management</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <BootstrapNav className="ml-auto">
          <BootstrapNav.Item>
            <BootstrapNav.Link as={Link} to="/signup">Sign Up</BootstrapNav.Link>
          </BootstrapNav.Item>
          <BootstrapNav.Item>
            <BootstrapNav.Link as={Link} to="/login">Login</BootstrapNav.Link>
          </BootstrapNav.Item>
        </BootstrapNav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;

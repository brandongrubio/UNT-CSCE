import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function AppNavbar() {
  return (
    <Navbar bg="dark nav-bg" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/home">
          TimeWise
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/pomodoro">
              Pomodoro
            </Nav.Link>
            <Nav.Link as={Link} to="/tasks">
              Tasks
            </Nav.Link>
            <Nav.Link as={Link} to="/calendar">
              Calendar
            </Nav.Link>
            <Nav.Link as={Link} to="/settings">
              Settings
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

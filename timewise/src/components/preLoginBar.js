import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function PreLoginBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          TimeWise
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default PreLoginBar;

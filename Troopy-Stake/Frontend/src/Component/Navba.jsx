import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { ROUTES } from "../constants/routes";

function Navba() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Car Rental</Navbar.Brand>

        <Nav className="ms-auto align-items-center">
          <Link to={ROUTES.home} className="text-white me-3 text-decoration-none">
            Home
          </Link>

          <Link to={ROUTES.login}>
            <Button className="ms-2">Login</Button>
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navba;
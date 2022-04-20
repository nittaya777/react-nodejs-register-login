import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavBar = () => {
  const token = localStorage.getItem("token");
  const menu = ()=>{
    if (token) {
      return <>
      <Nav.Item as="li">
        <Nav.Link onClick={() => {
          localStorage.removeItem("token");
          window.location = '/login';
        }}>
          Logout
        </Nav.Link>
      </Nav.Item>
    </>;
    } else {
      return <>
      <Nav.Item as="li">
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link as={Link} to="/signup">
              Sign up
            </Nav.Link>
          </Nav.Item>
      </>
    }
  }
  return (
    <Navbar bg="dark" variant="dark" sticky="top" expand="md">
      <Container>
        <Navbar.Brand href="/">React+Nodejs</Navbar.Brand>
        <Navbar.Toggle area-controls="responsive-navbar-nav"></Navbar.Toggle>
        <Navbar.Collapse>
          <Nav defaultActiveKey="/" as="ul">
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            </Nav.Item>
            {menu()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

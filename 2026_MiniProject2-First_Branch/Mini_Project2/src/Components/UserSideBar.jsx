import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import profile from "../assets/profile.svg";
import { useNavigate, Outlet } from "react-router-dom";

export default function UserSideBar() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="light" className="mb-3">
        <Container fluid>
          <Button variant="link" onClick={handleShow}>
            <img
              src={profile}
              alt="Profile"
              style={{ width: "30px", height: "30px" }}
            />
          </Button>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My Movies</Offcanvas.Title>
        </Offcanvas.Header>
        <Outlet />

        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="#" onClick={() => navigate("/")}>
              Home
            </Nav.Link>
            <Nav.Link href="#" onClick={() => navigate("/watchlist")}>
              My Watchlist
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

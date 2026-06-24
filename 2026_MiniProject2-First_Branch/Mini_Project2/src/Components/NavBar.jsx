import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import profile from "../assets/profile.svg";
import GenreDropdown from "./GenreDropdown";
import UserSideBar from "./UserSideBar";
import { useNavigate } from "react-router-dom";

export default function NavBar({ genres, selectedGenre, onSelectGenre }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSelectGenre(selectedGenre || "All", query.trim());
  };

  return (
    <Navbar sticky="top" expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#" onClick={() => navigate("/")}>
              Home
            </Nav.Link>
            <GenreDropdown
              genres={genres}
              selectedGenre={selectedGenre}
              onSelectGenre={onSelectGenre}
            />
          </Nav>
          <Form className="d-flex mx-auto w-75" onSubmit={handleSearchSubmit}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" variant="outline-success">
              Search
            </Button>
          </Form>
          {/*xTODO: make the icon bigger and into a button dropdown*/}
          <UserSideBar />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

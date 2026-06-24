import React, { useState } from "react";
import { NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function GenreDropdown({
  genres,
  selectedGenre,
  onSelectGenre,
}) {
  // Your automatic values (e.g., from an API or state)
  const options = genres || [
    "Action",
    "Another action",
    "Something else",
    "New Option",
  ];

  const [selectedValue, setSelectedValue] = useState("Select Genre");

  const handleSelect = (eventKey) => {
    setSelectedValue(eventKey);
    onSelectGenre(eventKey);
  };

  return (
    <NavDropdown
      id="dropdown-basic-button"
      title={selectedValue}
      onSelect={handleSelect}
    >
      {/* Map through the array to create items automatically */}
      {options.map((option, index) => (
        <NavDropdown.Item key={index} eventKey={option}>
          {option}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
}

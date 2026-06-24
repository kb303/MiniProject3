import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function MoreMovieDetails({
  title,
  description,
  imageUrl,
  onClose,
}) {
  const cleanDescription = description?.replace(/<[^>]*>/g, "") || "";

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <img
          src={imageUrl}
          alt={title}
          className="img-fluid mb-3 d-block mx-auto"
        />
        <p>{cleanDescription}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
